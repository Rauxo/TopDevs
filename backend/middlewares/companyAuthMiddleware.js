const jwt = require("jsonwebtoken");
const companyModel = require("../models/company.model");
const blacklistModel = require("../models/blacklist.model");

exports.companyAuthMiddleware = async (req, res, next) => {
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

    const company = await companyModel.findById(decoded.id).select("-password");

    if (!company) {
      return res.status(401).json({
        message: "Company not found",
      });
    }

    req.company = company;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
