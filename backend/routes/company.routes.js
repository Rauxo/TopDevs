const express = require("express");
const {
  companyCreateAccount,
  login,
  logout,
  getProfile
} = require("../controllers/company.controller");

const { uploadCompanyFiles } = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

//Register 
router.post("/register", uploadCompanyFiles, companyCreateAccount);

//Login
router.post("/login", login);

//Logout
router.post("/logout", logout);


module.exports = router;