const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Language", languageSchema);
