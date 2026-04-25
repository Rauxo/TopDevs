const express = require("express");
const { createAccount, login } = require("../controllers/auth.controller");

const router = express.Router();

//login
router.post("/login",login);

//register
router.post("/create",createAccount);

module.exports = router;
