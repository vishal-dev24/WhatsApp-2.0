const express = require('express');
const app = express();
const userModel = require('./routes/users.js');
const upload = require('./routes/multer.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const chatModel = require('./routes/chats.js');
// Online users tracker
const usersOnline = {};
// ✅ Socket.io Setup
const io = new Server(server, { cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'], credentials: true } })

// Register
app.post('/register', upload.single('image'), async (req, res) => {
    const { username, email, password } = req.body;
    const imagefile = req.file ? req.file.filename : null;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ username, email, password: hash, image: imagefile });
    const token = jwt.sign({ email: newUser.email, userid: newUser._id }, 'secretkey');
    res.cookie('token', token);
    res.json({ message: 'User registered', user: newUser });
    console.log('✅ User registered:', newUser);
});
// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ email: user.email, userid: user._id }, 'secretkey');
    res.cookie('token', token);
    res.json({ message: 'Login successful', user });
    console.log('✅ User logged in:', user);
});

// Authentication Middleware
function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const { userid, email } = jwt.verify(token, 'secretkey');
    req.user = { _id: userid, email };
    next();
}
// Profile
app.get('/profile', isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email });
    res.json(user);
});
// Logout
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});
// Get all users
app.get('/users', async (req, res) => {
    const users = await userModel.find();
    res.json(users);
});

// 🔁 Common function to send and emit a message
const sendMessageAndEmit = async ({ sender, receiver, message }) => {
    const newMessage = await chatModel.create({ sender, receiver, message });
    if (usersOnline[sender]) { io.to(usersOnline[sender]).emit("newMessage", newMessage) }
    if (usersOnline[receiver]) { io.to(usersOnline[receiver]).emit("newMessage", newMessage) }
    return newMessage
}

// ✅ Send Message (REST + Real-time)
app.post('/message', isLoggedIn, async (req, res) => {
    const message = await sendMessageAndEmit({
        sender: req.user._id,
        receiver: req.body.receiver,
        message: req.body.message
    })
    res.json(message);
});

// ✅ Fetch messages between two users
app.get('/messages/:userId', isLoggedIn, async (req, res) => {
    const messages = await chatModel.find({
        $or: [
            { sender: req.user._id, receiver: req.params.userId },
            { sender: req.params.userId, receiver: req.user._id }
        ]
    }).sort({ createdAt: 1 });
    res.json(messages);
});


io.on("connection", (socket) => {
    console.log("🔌 User Connected:", socket.id);
    socket.on("join", (userId) => {
        usersOnline[userId] = socket.id;
        io.emit("userOnline", Object.keys(usersOnline));
    });
    socket.on("sendMessage", async (messageData) => {
        try {
            const message = await sendMessageAndEmit(messageData);
        } catch (err) {
            console.error("❌ Error sending real-time message:", err);
        }
    });

    socket.on("disconnect", () => {
        let disconnectedUser;
        for (let userId in usersOnline) {
            if (usersOnline[userId] === socket.id) {
                disconnectedUser = userId;
                delete usersOnline[userId];
                break;
            }
        }
        if (disconnectedUser) {
            io.emit("userOnline", Object.keys(usersOnline));
            console.log(`❌ User ${disconnectedUser} disconnected`);
        }
    });
});

// ✅ Server Start
server.listen(3000, () => { console.log('🚀 Server is running on port 3000'); });
