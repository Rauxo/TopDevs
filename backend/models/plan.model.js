const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: {
    type: String, // Basic, Standard, Premium
    required: true,
  },
  type: {
    type: String, // User, Company
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
