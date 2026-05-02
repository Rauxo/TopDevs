const express = require("express");
const { createAccount, login, logout, getProfile, updateUserProfile, searchUsers, getUserPublicProfile, getLeaderboard } = require("../controllers/auth.controller");
const upload = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

//login
router.post("/login",login);

//register
router.post("/create",upload.single("profilePic"),createAccount);

//logout
router.post("/logout",logout)

router.get("/profile", authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, upload.single("profileImg"), updateUserProfile);
router.get("/search", searchUsers);
router.get("/public-profile/:id", getUserPublicProfile);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
