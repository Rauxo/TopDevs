const companyModel = require("../models/company.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");

exports.companyCreateAccount = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCompany = await companyModel.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: "Company email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle files
    const companyIcon = req.files && req.files.companyIcon ? req.files.companyIcon[0].path.replace(/\\/g, "/") : "";
    const legalDocument = req.files && req.files.legalDocument ? req.files.legalDocument[0].path.replace(/\\/g, "/") : "";
    const companyImages = req.files && req.files.companyImages ? req.files.companyImages.map(file => file.path.replace(/\\/g, "/")) : [];

    if (companyImages.length < 2) {
        return res.status(400).json({ message: "Minimum 2 company images required" });
    }

    const newCompany = await companyModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      companyIcon,
      legalDocument,
      companyImages,
      isVerified: false, 
    });

    const companyObj = newCompany.toObject();
    delete companyObj.password;

    return res.status(201).json({
      message: "Company registered successfully",
      company: companyObj,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

exports.companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const company = await companyModel.findOne({ email });
    if (!company) {
      return res.status(404).json({ message: "Company Not Found." });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    const companyObj = company.toObject();
    delete companyObj.password;

    return res.status(200).json({
      message: "Login successful",
      company: companyObj,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

exports.companyLogout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }

    await blacklistModel.create({ token });
    res.clearCookie("token");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.companyGetProfile = async (req, res) => {
  try {
    // req.company is set by authMiddleware
    return res.status(200).json({ company: req.company });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.companyGetPublicProfile = async (req, res) => {
  try {
    const company = await companyModel.findById(req.params.id).select("-password");
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json({ company });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch company profile" });
  }
};

exports.updateCompanyProfile = async (req, res) => {
  try {
    const { name, email, phone, address, about, founded, teamSize } = req.body;
    const updateData = { name, email, phone, address, about, founded, teamSize };
    
    if (req.files && req.files.companyIcon) {
      updateData.companyIcon = req.files.companyIcon[0].path.replace(/\\/g, "/");
    }

    const updatedCompany = await companyModel.findByIdAndUpdate(req.company._id, updateData, { new: true }).select("-password");
    res.status(200).json({ message: "Profile updated successfully", company: updatedCompany });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

exports.searchCompanies = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json({ companies: [] });
    
    const companies = await companyModel.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } }
      ]
    }).select("name companyIcon about address");
    
    res.status(200).json({ companies });
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await companyModel.find().select("name companyIcon about address isVerified");
    res.status(200).json({ companies });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch companies" });
  }
};



