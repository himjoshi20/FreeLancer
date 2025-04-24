const mongoose = require("mongoose");

const AgreementSchema = new mongoose.Schema({
  serviceRequest: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
  partiesInvolved: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  terms: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Completed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Agreement", AgreementSchema);
