const adminModel = require("../models/admin.model");
const userModel = require("../models/user.models");
const companyModel = require("../models/company.model");
const jobModel = require("../models/job.model");
const jobApplicationModel = require("../models/jobApplication.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Seed admin if not exists (using .env)
const seedAdmin = async () => {
    try {
        const phone = process.env.ADMIN_PHONE;
        const password = process.env.ADMIN_PASSWORD;

        if (!phone || !password) {
            console.warn("Admin seeding skipped: Missing ADMIN_PHONE or ADMIN_PASSWORD in .env");
            return;
        }

        const existingAdmin = await adminModel.findOne({ phone });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await adminModel.create({ phone, password: hashedPassword });
            console.log("Admin seeded successfully");
        }
    } catch (err) {
        console.error("Admin seeding error:", err);
    }
};
seedAdmin();

exports.adminLogin = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const admin = await adminModel.findOne({ phone });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

        res.status(200).json({ message: "Admin login successful", token, admin: { phone: admin.phone, role: admin.role } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Dashboard Stats
exports.getStats = async (req, res) => {
    try {
        const userCount = await userModel.countDocuments();
        const companyCount = await companyModel.countDocuments();
        const jobCount = await jobModel.countDocuments();
        const applicationCount = await jobApplicationModel.countDocuments();
        
        const recentCompanies = await companyModel.find({ isVerified: false }).sort({ createdAt: -1 }).limit(5);
        const recentJobs = await jobModel.find().sort({ createdAt: -1 }).limit(5).populate("company", "name");

        res.status(200).json({
            stats: { userCount, companyCount, jobCount, applicationCount },
            recentCompanies,
            recentJobs
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};

// User Management
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select("-password");
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user" });
    }
};

// Company Management
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await companyModel.find().select("-password");
        res.status(200).json({ companies });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch companies" });
    }
};

exports.verifyCompany = async (req, res) => {
    try {
        const company = await companyModel.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
        if (!company) return res.status(404).json({ message: "Company not found" });

        // Send Email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: company.email,
            subject: "Account Verified - TopDevs",
            text: `Hello ${company.name},\n\nYour company account has been verified successfully. You can now post jobs and manage applicants.\n\nBest regards,\nTopDevs Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error("Email error:", error);
            else console.log("Email sent:", info.response);
        });

        res.status(200).json({ message: "Company verified successfully", company });
    } catch (error) {
        res.status(500).json({ message: "Failed to verify company" });
    }
};

exports.blockCompany = async (req, res) => {
    try {
        // We can use isVerified: false as a way to "block" or add a new field. 
        // For now, let's just toggle verification as a simple block mechanism or we could add a 'isBlocked' field.
        const company = await companyModel.findById(req.params.id);
        company.isVerified = !company.isVerified;
        await company.save();
        res.status(200).json({ message: `Company ${company.isVerified ? "unblocked" : "blocked"} successfully` });
    } catch (error) {
        res.status(500).json({ message: "Failed to update company status" });
    }
};

// Job Management
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await jobModel.find().populate("company", "name email");
        res.status(200).json({ jobs });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        await jobModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete job" });
    }
};

// Plan Management
const planModel = require("../models/plan.model");

exports.createPlan = async (req, res) => {
    try {
        const { name, type, price, messageLimit, durationInDays } = req.body;
        const plan = await planModel.create({ name, type, price, messageLimit, durationInDays });
        res.status(201).json({ message: "Plan created successfully", plan });
    } catch (error) {
        res.status(500).json({ message: "Failed to create plan" });
    }
};

exports.getAllPlans = async (req, res) => {
    try {
        const plans = await planModel.find().sort({ createdAt: -1 });
        res.status(200).json({ plans });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch plans" });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        await planModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete plan" });
    }
};
