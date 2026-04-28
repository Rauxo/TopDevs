const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");
const blacklistModel = require("../models/blacklist.model");

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Token missing",
      });
    }

    // blacklist check
    const blacklisted = await blacklistModel.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({
        message: "Token is blacklisted",
      });
    }

    // verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
