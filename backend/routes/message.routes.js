const express = require("express");
const router = express.Router();
const { sendMessage, getConversations, getMessages, acceptConversation } = require("../controllers/message.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { companyAuthMiddleware } = require("../middlewares/companyAuthMiddleware");

// Dual middleware helper
const dualAuth = async (req, res, next) => {
    // Check if token belongs to user or company
    const jwt = require("jsonwebtoken");
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userModel = require("../models/user.models");
        const companyModel = require("../models/company.model");
        
        let user = await userModel.findById(decoded.id);
        if (user) {
            req.user = user;
            return next();
        }

        let company = await companyModel.findById(decoded.id);
        if (company) {
            req.company = company;
            return next();
        }

        return res.status(401).json({ message: "Unauthorized" });
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

router.post("/send", dualAuth, sendMessage);
router.get("/conversations", dualAuth, getConversations);
router.get("/messages/:conversationId", dualAuth, getMessages);
router.put("/accept/:conversationId", dualAuth, acceptConversation);

module.exports = router;
