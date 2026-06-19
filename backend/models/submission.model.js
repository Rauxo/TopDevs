const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  timeTaken: {
    type: Number, 
    required: true,
  },
  status: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "Runtime Error"],
    required: true,
  },
  pointsAwarded: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Submission", submissionSchema);
