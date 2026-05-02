const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  profileImg: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    default: "Developer passionate about building beautiful and functional web applications. 🚀",
  },
},{
    timestamps:true
});

module.exports = mongoose.model('User', userSchema);