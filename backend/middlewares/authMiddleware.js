const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");
const blacklistModel = require("../models/blacklist.model");

exports.authMiddleware = async (req, res, next) => {
  try {
    //Token extract
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized: Token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    //  BLACKLIST CHECK
    const blacklisted = await blacklistModel.findOne({ token });

    if (blacklisted) {
      return res.status(401).json({
        message: "Token is blacklisted. Please login again",
      });
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check user exists
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Attach user
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
