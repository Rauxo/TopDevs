const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true,
  },
  levelNumber: {
    type: Number,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
  },
}, {
  timestamps: true
});

levelSchema.index({ language: 1, levelNumber: 1 }, { unique: true });

module.exports = mongoose.model("Level", levelSchema);
