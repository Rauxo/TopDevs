const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  applyJob,
  getCompanyJobs,
  getJobApplications,
  getUserApplications,
} = require("../controllers/job.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { companyAuthMiddleware } = require("../middlewares/companyAuthMiddleware");
const upload = require("../middlewares/upload");

// Public routes
router.get("/all", getAllJobs);
router.get("/detail/:id", getJobById);

// Company routes
router.post("/create", companyAuthMiddleware, createJob);
router.get("/company-jobs", companyAuthMiddleware, getCompanyJobs);
router.get("/applications/:jobId", companyAuthMiddleware, getJobApplications);

// User routes
router.post("/apply", authMiddleware, upload.single("resume"), applyJob);
router.get("/my-applications", authMiddleware, getUserApplications);

module.exports = router;
