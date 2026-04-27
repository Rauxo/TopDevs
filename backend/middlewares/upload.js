const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// filter
const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const docTypes = ["application/pdf"];

  if (imageTypes.includes(file.mimetype) || docTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDF allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  // user 
  uploadUserProfile: upload.single("profilePic"),

  // company 
  uploadCompanyFiles: upload.fields([
    { name: "companyIcon", maxCount: 1 },
    { name: "companyImages", maxCount: 5 },
    { name: "legalDocument", maxCount: 1 },
  ]),
};