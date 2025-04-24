const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: [{ type: String, index: true }], // ✅ Indexed for faster matching
  expertiseLevel: { type: String, enum: ["Beginner", "Intermediate", "Expert"], required: true },
  portfolio: [{ type: String }], 
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  otp: { type: String },
});

// ✅ Ensure index is applied
UserSchema.index({ skills: 1 });

module.exports = mongoose.model("User", UserSchema);
