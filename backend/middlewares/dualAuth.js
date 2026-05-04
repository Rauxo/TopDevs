const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");
const companyModel = require("../models/company.model");

exports.dualAuth = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
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
