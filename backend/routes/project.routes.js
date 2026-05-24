const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createProject, getUserProjects, deleteProject } = require("../controllers/project.controller");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/", authMiddleware, upload.array("images", 5), createProject);
router.get("/user/:userId", getUserProjects);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
