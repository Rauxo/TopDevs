const express = require("express");
const { companyLogin, companyCreateAccount, companyLogout, companyGetProfile, companyGetPublicProfile, updateCompanyProfile } = require("../controllers/company.controller");
const upload = require("../middlewares/upload");
const { companyAuthMiddleware } = require("../middlewares/companyAuthMiddleware");

const router = express.Router();

router.post("/login", companyLogin);

router.post("/create", upload.fields([
  { name: 'companyIcon', maxCount: 1 },
  { name: 'legalDocument', maxCount: 1 },
  { name: 'companyImages', maxCount: 5 }
]), companyCreateAccount);

router.post("/logout", companyLogout);

router.get("/myCompany", companyAuthMiddleware, companyGetProfile);
router.put("/update-profile", companyAuthMiddleware, upload.fields([{ name: "companyIcon", maxCount: 1 }]), updateCompanyProfile);
router.get("/public-profile/:id", companyGetPublicProfile);

module.exports = router;