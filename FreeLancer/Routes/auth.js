const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { User } = require("../models");

const router = express.Router();

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ✅ Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, skills, expertiseLevel } = req.body;

    // Validate required fields
    if (!name || !email || !password || !skills || !expertiseLevel) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Create User
    user = new User({
      name,
      email,
      password: hashedPassword,
      skills,
      expertiseLevel,
      otp,
    });

    await user.save();

    // Check if email configuration is set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email configuration missing");
      // Don't fail registration if email is not configured
      console.log("OTP for manual verification:", otp);
      return res.json({ 
        msg: "User registered successfully. Please note down this OTP for verification: " + otp,
        otp: otp // Send OTP in response for development
      });
    }

    // Send OTP Email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your Email - SkillSwap",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Welcome to SkillSwap!</h2>
            <p>Thank you for registering. Please use the following OTP to verify your email:</p>
            <div style="background-color: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #4F46E5; margin: 0;">${otp}</h1>
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
      res.json({ msg: "User registered successfully. Please check your email for OTP verification." });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail registration if email fails
      console.log("OTP for manual verification:", otp);
      res.json({ 
        msg: "User registered successfully. Please note down this OTP for verification: " + otp,
        otp: otp // Send OTP in response for development
      });
    }
  } catch (err) {
    console.error("Registration error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: "Registration failed. Please try again later." });
  }
});

const { authenticateUser } = require("../middlewares/authMiddleware");
router.get("/protected", authenticateUser, (req, res) => {
  res.json({ msg: "Protected route accessed!", user: req.user });
});

// ✅ Verify Email OTP
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    console.log(email,otp);
    if (!user || user.otp !== otp) return res.status(400).json({ msg: "Invalid OTP" });

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.json({ msg: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Check if email is verified
    if (!user.isVerified) return res.status(400).json({ msg: "Please verify your email first" });

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "Server error: Missing JWT secret" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "defaultSecretKey", { expiresIn: "7d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, skills: user.skills } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
