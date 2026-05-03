const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        participantId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "participants.participantType",
        },
        participantType: {
          type: String,
          required: true,
          enum: ["User", "Company"],
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
    initiatedBy: {
        id: mongoose.Schema.Types.ObjectId,
        type: { type: String, enum: ["User", "Company"] }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
