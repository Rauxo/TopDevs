const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");
const companyModel = require("../models/company.model");
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

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let account = null;

    //  check user 
    account = await userModel.findById(decoded.id).select("-password");

    // check company
    if (!account) {
      account = await companyModel.findById(decoded.id).select("-password");
    }

    if (!account) {
      return res.status(401).json({
        message: "Account not found",
      });
    }

    req.account = account;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};