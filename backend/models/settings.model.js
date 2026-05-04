const mongoose = require("mongoose");

const levelRangeSchema = new mongoose.Schema({
  minLevel: Number,
  maxLevel: Number,
  tickColor: String, // Hex or CSS color
});

const settingsSchema = new mongoose.Schema({
  levelRanges: [levelRangeSchema],
}, {
  timestamps: true
});

module.exports = mongoose.model("Settings", settingsSchema);
