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
    default: "Developer passionate about building beautiful and functional web applications. ",
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
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
  points: {
    type: Number,
    default: 0,
  },
  profileLevel: {
    type: Number,
    default: 1,
  },
  selectedLanguages: [{
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Language",
    },
    currentLevel: {
      type: Number,
      default: 1,
    },
    completedLevels: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
    }],
    startDate: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
    },
    progress: {
      type: Number,
      default: 0,
    }
  }],
},{
    timestamps:true
});

module.exports = mongoose.model('User', userSchema);