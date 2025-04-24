const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/your_database_TCP')

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    image: String,
});

module.exports = mongoose.model('User', userSchema);
