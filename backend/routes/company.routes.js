const express = require("express");

const router = express.Router();

router.post("/login");

router.post("/create");

router.post("/logout");

router.get("/myCompany")

module.exports = router;