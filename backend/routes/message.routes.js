const express = require("express");
const router = express.Router();
const { sendMessage, getConversations, getMessages, acceptConversation } = require("../controllers/message.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { companyAuthMiddleware } = require("../middlewares/companyAuthMiddleware");

const { dualAuth } = require("../middlewares/dualAuth");

router.post("/send", dualAuth, sendMessage);
router.get("/conversations", dualAuth, getConversations);
router.get("/messages/:conversationId", dualAuth, getMessages);
router.put("/accept/:conversationId", dualAuth, acceptConversation);

module.exports = router;
