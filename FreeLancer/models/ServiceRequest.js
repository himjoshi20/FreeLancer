const mongoose = require("mongoose");

const ServiceRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceDetails: { type: String, required: true },
  skillsRequired: [{ type: String, required: true }], // Skills needed for service
  status: { type: String, enum: ["Open", "In Progress", "Completed"], default: "Open" },
  negotiation: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
