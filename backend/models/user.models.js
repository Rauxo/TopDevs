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
  isPremium: {
    type: Boolean,
    default: false,
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
  },
  premiumExpiry: {
    type: Date,
  },
  messagesSent: {
    type: Number,
    default: 0,
  },
},{
    timestamps:true
});

module.exports = mongoose.model('User', userSchema);