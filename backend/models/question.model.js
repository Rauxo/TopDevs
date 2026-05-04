const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Level",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  boilerplateCode: {
    type: String,
    required: true,
  },
  testCases: [{
    input: String,
    expectedOutput: String,
  }],
  points: {
    type: Number,
    required: true,
    default: 10,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Question", questionSchema);
