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
    deleteJob,
    createPlan,
    getAllPlans,
    deletePlan
} = require("../controllers/admin.controller");
const learningAdminController = require("../controllers/learning.admin.controller");
const upload = require("../middlewares/upload");
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
router.post("/plans", adminAuthMiddleware, createPlan);
router.get("/plans", adminAuthMiddleware, getAllPlans);
router.delete("/plan/:id", adminAuthMiddleware, deletePlan);

// Learning Admin Routes
router.post("/language", adminAuthMiddleware, upload.single("icon"), learningAdminController.createLanguage);
router.put("/language/:id", adminAuthMiddleware, upload.single("icon"), learningAdminController.updateLanguage);
router.delete("/language/:id", adminAuthMiddleware, learningAdminController.deleteLanguage);

router.post("/level", adminAuthMiddleware, upload.single("image"), learningAdminController.createLevel);
router.get("/levels/:languageId", adminAuthMiddleware, learningAdminController.getLevels);
router.put("/level/:id", adminAuthMiddleware, upload.single("image"), learningAdminController.updateLevel);
router.delete("/level/:id", adminAuthMiddleware, learningAdminController.deleteLevel);

router.post("/question", adminAuthMiddleware, learningAdminController.createQuestion);
router.get("/questions/:levelId", adminAuthMiddleware, learningAdminController.getQuestions);
router.put("/question/:id", adminAuthMiddleware, learningAdminController.updateQuestion);
router.delete("/question/:id", adminAuthMiddleware, learningAdminController.deleteQuestion);

router.put("/learning-settings", adminAuthMiddleware, learningAdminController.updateSettings);

module.exports = router;
