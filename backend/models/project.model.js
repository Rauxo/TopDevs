const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    validate: [arrayLimit, 'Projects must have between 1 and 5 images'],
    required: true,
  },
  liveLink: {
    type: String,
  },
  githubLink: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

function arrayLimit(val) {
  return val.length > 0 && val.length <= 5;
}

module.exports = mongoose.model('Project', projectSchema);
