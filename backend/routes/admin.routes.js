const express = require("express");
const router = express.Router();
const {
    adminLogin,
    getStats,
    getAllUsers,
    deleteUser,
    getAllCompanies,
    verifyCompany,
    blockCompany,
    getAllJobs,
    deleteJob
} = require("../controllers/admin.controller");
const { adminAuthMiddleware } = require("../middlewares/adminAuthMiddleware");

router.post("/login", adminLogin);

// Protected Admin Routes
router.get("/stats", adminAuthMiddleware, getStats);
router.get("/users", adminAuthMiddleware, getAllUsers);
router.delete("/user/:id", adminAuthMiddleware, deleteUser);
router.get("/companies", adminAuthMiddleware, getAllCompanies);
router.put("/company/verify/:id", adminAuthMiddleware, verifyCompany);
router.put("/company/block/:id", adminAuthMiddleware, blockCompany);
router.get("/jobs", adminAuthMiddleware, getAllJobs);
router.delete("/job/:id", adminAuthMiddleware, deleteJob);

module.exports = router;
