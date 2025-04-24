const express = require("express");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { User } = require("../models");

const router = express.Router();

// ✅ Match users based on required skills
router.get("/find-matches", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const { skills } = user;

    // ✅ Find users who have at least one matching skill but exclude the current user
    const matches = await User.find({
      skills: { $in: skills },
      _id: { $ne: user._id },
    }).select("-password"); // Exclude password

    res.json({ matches });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Find users who need a specific skill
router.get("/find-by-skill/:skill", authenticateUser, async (req, res) => {
  try {
    const skill = req.params.skill;

    const users = await User.find({
      skills: skill,
      _id: { $ne: req.user.id }, // Exclude self
    }).select("-password");

    if (users.length === 0) {
      return res.status(404).json({ msg: "No users found with this skill" });
    }

    res.json({ users });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
