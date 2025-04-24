const express = require("express");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { User } = require("../models");
const upload = require("../config/multer");

const router = express.Router();

// ✅ Get User Profile
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Update Profile
router.put("/update", authenticateUser, async (req, res) => {
  try {
    const { name, skills, expertiseLevel } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, skills, expertiseLevel },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Upload Portfolio File (Cloudinary)
router.post("/upload", authenticateUser, upload.single("portfolio"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ msg: "No file uploaded." });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.portfolio.push(req.file.path); // Store Cloudinary URL
    await user.save();

    res.json({ msg: "File uploaded successfully!", url: req.file.path });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
