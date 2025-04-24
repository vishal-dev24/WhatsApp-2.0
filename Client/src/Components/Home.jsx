import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { io } from "socket.io-client";
const socket = io("http://localhost:3000", { withCredentials: true });

const Home = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        axios.get("http://localhost:3000/profile", { withCredentials: true })
            .then(res => setCurrentUser(res.data))
            .catch(() => navigate("/login"));
    }, [navigate]);

    useEffect(() => {
        axios.get("http://localhost:3000/users", { withCredentials: true })
            .then(res => setUsers(res.data));
    }, []);

    useEffect(() => {
        const fetchMessages = () => {
            if (selectedUser) {
                axios.get(`http://localhost:3000/messages/${selectedUser._id}`, { withCredentials: true })
                    .then(res => setMessages(res.data))
                    .catch(err => console.error("Error fetching messages:", err));
            }
        };
        fetchMessages(); // Pehli baar turant messages load kare
        const interval = setInterval(fetchMessages, 1000); // Har 1 second me refresh karega
        return () => clearInterval(interval); // Jab selectedUser change ho ya component unmount ho, tab interval clear hoga
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        const msgData = {
            sender: currentUser._id,
            receiver: selectedUser._id,
            message: newMessage,
            createdAt: new Date()
        };
        setMessages(prev => [...prev, msgData]);
        socket.emit("sendMessage", msgData);
        setNewMessage("");
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="bg-white px-4 py-3 flex justify-between items-center shadow-md fixed top-0 w-full z-10">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-teal-500">WhatsApp</h1>
                <div className="flex items-center gap-2">
                    {currentUser && (
                        <div className="flex items-center">
                            <img src={`http://localhost:3000/uploads/${currentUser.image}`} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2" />
                            <span className="font-medium text-lg">{currentUser.username}</span>
                        </div>
                    )}
                    <button onClick={() => navigate("/profile")} className="bg-teal-500 text-white px-3 py-1 rounded">Profile</button>
                </div>
            </div>

            <div className="flex mt-14 h-full fixed w-full z-0">
                <div className="bg-white border-r overflow-y-auto h-[calc(100vh-56px)] p-3 w-full sm:w-1/3 md:w-1/3">
                    {users.map((user) => (
                        <div key={user._id} onClick={() => setSelectedUser(user)} className={`flex items-center py-3 px-3 cursor-pointer hover:bg-gray-100 rounded-lg ${selectedUser?._id === user._id && "bg-gray-200"}`}>
                            <img src={`http://localhost:3000/uploads/${user.image}`} className="w-12 h-12 border border-teal-500 rounded-full mr-3" />
                            <div className="flex-1">
                                <span className="text-md font-medium">{user.username}</span>
                                <p className="text-xs text-gray-500">{user.status || "Hey there! I'm using WhatsApp"}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`flex flex-col flex-1 ${isMobile && selectedUser ? "block" : "hidden sm:flex"}`}>
                    {selectedUser ? (
                        <>
                            <div className="bg-white p-4 shadow-lg flex justify-between items-center fixed w-full sm:w-2/3">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        <img src={`http://localhost:3000/uploads/${selectedUser.image}`} className="w-10 h-10 rounded-full border border-teal-500" />
                                        <h2 className="text-md sm:text-lg font-bold ms-3">{selectedUser.username}</h2>
                                    </div>
                                    {isMobile && <button onClick={() => setSelectedUser(null)} className="mr-3 px-3 py-1 bg-gray-200 rounded text-sm">Back</button>}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 mt-20 mb-28">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender === currentUser?._id ? "justify-end" : "justify-start"} mb-3`}>
                                        <div className={`px-3 py-2 rounded-lg ${msg.sender === currentUser?._id ? "bg-green-300" : "bg-gray-200 text-black"}`}>
                                            {msg.message}
                                            <span className="block text-xs text-gray-800 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-3 bg-slate-300 border-t flex fixed bottom-0 w-full sm:w-2/3">
                                <input type="text" className="flex-1 p-2 border capitalize rounded-lg" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                                <button onClick={sendMessage} className="ml-2 bg-teal-700 text-white px-5 py-2 rounded-lg">Send</button>
                            </div>
                        </>
                    ) : <div className="flex items-center justify-center h-full text-gray-600">Select a user to start chatting</div>}
                </div>

            </div>
        </div>
    );
};

export default Home;