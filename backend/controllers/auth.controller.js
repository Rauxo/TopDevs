const userModel = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");

//controller to create account
exports.createAccount = async (req, res) => {
  try {
    const { username, profileImg, email, password } = req.body;

    //check all fields or not
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    //check is  existing
    const Emailexisting = await userModel.findOne({ email: email });
    const Usernameexisting = await userModel.findOne({ username: username });
    if (Emailexisting) {
      return res.status(400).json({
        message: "User email is already exist",
      });
    } else if (Usernameexisting) {
      return res.status(400).json({
        message: "username is already exist",
      });
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      username,
      profileImg: profileImg || "",
      email: email,
      password: hashedPassword,
    });

    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profileImg: newUser.profileImg,
    };

    return res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
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

    // Send response (without password)
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImg: user.profileImg,
      },
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
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        message: "Token not found",
      });
    }

    // Save token in blacklist
    await blacklistModel.create({ token });

    return res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};