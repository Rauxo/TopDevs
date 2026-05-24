const userModel = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");

//controller to create account
exports.createAccount = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // file se image milega
   const profileImg = req.file ? req.file.path.replace(/\\/g, "/") : "";

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const Emailexisting = await userModel.findOne({ email });
    const Usernameexisting = await userModel.findOne({ username });

    if (Emailexisting) {
      return res.status(400).json({
        message: "User email already exists",
      });
    }

    if (Usernameexisting) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      profileImg,
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: "User registered successfully",
      user: userObj,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

//User Logged in Controller
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log(`Useername is ${username} and password is ${password}`)
    //check all fields or not
    if (!username || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    //check the user is exist or not
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({
        message: "User Not Found.",
      });
    }
    //  Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    // Generate token (JWT)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: "Login successful",
      user: userObj,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

//logout functionality
exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        message: "Token not found",
      });
    }

    // optional blacklist
    await blacklistModel.create({ token });

    // clear cookie
    res.clearCookie("token");

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, about } = req.body;
    const updateData = { username, email, about };
    
    if (req.file) {
      updateData.profileImg = req.file.path.replace(/\\/g, "/");
    }

    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, updateData, { new: true }).select("-password");
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json({ users: [] });

    const users = await userModel.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ]
    }).select("username profileImg about");
    
    res.status(200).json({ users });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
};


exports.getUserPublicProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password").populate("selectedLanguages.language");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { language, level } = req.query;
    const mongoose = require("mongoose");
    
    let matchStage = {};
    if (level) {
      matchStage.profileLevel = parseInt(level);
    }

    if (language) {
      let languageId;
      try {
        languageId = new mongoose.Types.ObjectId(language);
      } catch (e) {
        return res.status(400).json({ message: "Invalid language ID" });
      }

      const users = await userModel.aggregate([
        { $match: matchStage },
        { $unwind: "$selectedLanguages" },
        { $match: { "selectedLanguages.language": languageId } },
        {
          $lookup: {
            from: "submissions",
            let: { userId: "$_id" },
            pipeline: [
              { $match: { 
                  $expr: { 
                    $and: [
                      { $eq: ["$user", "$$userId"] },
                      { $eq: ["$language", languageId] },
                      { $eq: ["$status", "Accepted"] }
                    ]
                  } 
              }},
              { $group: { _id: null, totalTimeTaken: { $sum: "$timeTaken" } } }
            ],
            as: "submissionStats"
          }
        },
        {
          $addFields: {
            totalTimeTaken: { 
              $cond: {
                if: { $gt: [{ $size: "$submissionStats" }, 0] },
                then: { $arrayElemAt: ["$submissionStats.totalTimeTaken", 0] },
                else: 999999999 // Large number so they rank lower
              }
            },
            progress: "$selectedLanguages.progress"
          }
        },
        { $sort: { progress: -1, totalTimeTaken: 1, createdAt: 1 } },
        { $limit: 10 },
        { $project: { username: 1, profileImg: 1, about: 1, createdAt: 1, profileLevel: 1, progress: 1, totalTimeTaken: 1 } }
      ]);
      
      return res.status(200).json({ users });
    } else {
      const users = await userModel.find(matchStage)
        .select("username profileImg about createdAt profileLevel")
        .sort({ profileLevel: -1, createdAt: 1 })
        .limit(10);
      return res.status(200).json({ users });
    }
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

