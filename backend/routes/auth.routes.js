const express = require("express");
const { createAccount, login, logout } = require("../controllers/auth.controller");
const upload = require("../middlewares/upload");

const router = express.Router();

//login
router.post("/login",login);

//register
router.post("/create",upload.single("profilePic"),createAccount);

//logout
router.post("/logout",logout)

module.exports = router;
