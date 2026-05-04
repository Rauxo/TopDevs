const express = require("express");
const router = express.Router();
const learningController = require("../controllers/learning.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Language routes
router.get("/languages", learningController.getLanguages);
router.post("/languages/select", authMiddleware, learningController.selectLanguage);

// Level routes
router.get("/levels/:languageId", authMiddleware, learningController.getLevels);
router.get("/level/:levelId", authMiddleware, learningController.getLevelContent);

// Question routes
router.get("/questions/:levelId", authMiddleware, learningController.getQuestions);
router.post("/run-code", authMiddleware, learningController.runCode);
router.post("/submit-code", authMiddleware, learningController.submitCode);

// Settings/Tick routes
router.get("/settings", learningController.getSettings);

module.exports = router;
