const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const companyModel = require("../models/company.model");

//controller to create account
exports.companyCreateAccount = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    // files
    const companyIcon = req.files?.companyIcon
      ? req.files.companyIcon[0].path.replace(/\\/g, "/")
      : "";

    const companyImages = req.files?.companyImages
      ? req.files.companyImages.map((file) => file.path.replace(/\\/g, "/"))
      : [];

    const legalDocument = req.files?.legalDocument
      ? req.files.legalDocument[0].path.replace(/\\/g, "/")
      : "";

    if (!name || !phone || !address || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (!legalDocument) {
      return res.status(400).json({
        message: "Legal document is required",
      });
    }
    // image validation
    if (companyImages.length < 2 || companyImages.length > 5) {
      return res.status(400).json({
        message: "Upload 2 to 5 company images",
      });
    }

    const Emailexisting = await companyModel.findOne({ email });
    const Phoneexisting = await companyModel.findOne({ phone });

    if (Emailexisting) {
      return res.status(400).json({
        message: "Company email already exists",
      });
    }

    if (Phoneexisting) {
      return res.status(400).json({
        message: "This Phone Number is already used",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCompany = await companyModel.create({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      companyIcon,
      companyImages,
      legalDocument,
    });

    return res.status(201).json({
      message:
        "Company registered successfully. Please wait till verification.",
      company: {
        _id: newCompany._id,
        name: newCompany.name,
        email: newCompany.email,
        companyIcon: `http://localhost:5000/${newCompany.companyIcon}`,
        companyImages: newCompany.companyImages.map(
          (img) => `http://localhost:5000/${img}`,
        ),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

//Company Logged in Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check all fields or not
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    //check the user is exist or not
    const company = await companyModel.findOne({ email });
    if (!company) {
      return res.status(404).json({
        message: "Company Not Found.",
      });
    }
    //  Compare password
    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    // Generate token (JWT)
    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Login successful",
      company: {
        _id: company._id,
        email: company.email,
        name: company.name,
        companyIcon: `http://localhost:5000/${company.companyIcon}`,
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
