const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio_uploads", // Cloudinary folder
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
  },
});

const upload = multer({ storage });

module.exports = upload;
