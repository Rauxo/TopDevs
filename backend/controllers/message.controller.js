const conversationModel = require("../models/conversation.model");
const messageModel = require("../models/message.model");
const userModel = require("../models/user.models");
const companyModel = require("../models/company.model");

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverType, text } = req.body;
    const senderId = req.user?._id || req.company?._id;
    const senderType = req.user ? "User" : "Company";

    if (!senderId) return res.status(401).json({ message: "Unauthorized" });

    // Find or create conversation
    let conversation = await conversationModel.findOne({
      $and: [
        { "participants.participantId": senderId },
        { "participants.participantId": receiverId }
      ]
    });

    if (!conversation) {
      // User to User check (prohibited)
      if (senderType === "User" && receiverType === "User") {
        return res.status(403).json({ message: "Direct user-to-user messaging is not allowed." });
      }

      // If Company initiated, it's accepted. If User initiated to Company, it's pending.
      const status = senderType === "Company" ? "accepted" : "pending";

      conversation = await conversationModel.create({
        participants: [
          { participantId: senderId, participantType: senderType },
          { participantId: receiverId, participantType: receiverType }
        ],
        status,
        initiatedBy: { id: senderId, type: senderType }
      });
    }

    const newMessage = await messageModel.create({
      conversationId: conversation._id,
      senderId,
      senderType,
      text
    });

    res.status(201).json({ message: newMessage, conversation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user?._id || req.company?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const conversations = await conversationModel.find({
      "participants.participantId": userId
    }).sort({ updatedAt: -1 });

    // Populate participant details manually or via complex populate
    const populatedConversations = await Promise.all(conversations.map(async (conv) => {
      const otherParticipant = conv.participants.find(p => p.participantId.toString() !== userId.toString());
      let details = null;
      if (otherParticipant.participantType === "User") {
        details = await userModel.findById(otherParticipant.participantId).select("username profileImg");
      } else {
        details = await companyModel.findById(otherParticipant.participantId).select("name companyIcon");
      }
      return { ...conv.toObject(), otherParticipant: details, otherParticipantType: otherParticipant.participantType };
    }));

    res.status(200).json({ conversations: populatedConversations });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await messageModel.find({ conversationId }).sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

exports.acceptConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await conversationModel.findByIdAndUpdate(
      conversationId,
      { status: "accepted" },
      { new: true }
    );
    res.status(200).json({ conversation });
  } catch (error) {
    res.status(500).json({ message: "Failed to accept conversation" });
  }
};
