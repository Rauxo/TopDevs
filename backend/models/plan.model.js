const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
  },
  type: {
    type: String, 
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  messageLimit: {
    type: Number,
    required: true,
  },
  durationInDays: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Plan", planSchema);
