const express = require("express");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { User, ServiceRequest } = require("../models");

const router = express.Router();

// ✅ Create a Service Request
router.post("/create", authenticateUser, async (req, res) => {
  try {
    const { serviceDetails, skillsRequired } = req.body;

    const serviceRequest = new ServiceRequest({
      requester: req.user.id,
      serviceDetails,
      skillsRequired
    });

    await serviceRequest.save();
    res.json({ msg: "Service request created successfully", serviceRequest });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Get All Open Service Requests
router.get("/all", authenticateUser, async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find({ status: "Open" }).populate("requester", "name email");
    res.json(serviceRequests);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Update Service Status
router.put("/update/:id", authenticateUser, async (req, res) => {
  try {
    const { status } = req.body;
    const serviceRequest = await ServiceRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!serviceRequest) return res.status(404).json({ msg: "Service request not found" });

    res.json(serviceRequest);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Get Service Request by ID
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id).populate("requester", "name email expertiseLevel");
    
    if (!serviceRequest) {
      return res.status(404).json({ msg: "Service request not found" });
    }

    res.json({
      serviceRequest: {
        id: serviceRequest._id,
        userId: serviceRequest.requester._id,
        serviceDetails: serviceRequest.serviceDetails,
        skillsRequired: serviceRequest.skillsRequired,
        status: serviceRequest.status,
        createdAt: serviceRequest.createdAt,
        owner: {
          id: serviceRequest.requester._id,
          name: serviceRequest.requester.name,
          email: serviceRequest.requester.email,
          expertiseLevel: serviceRequest.requester.expertiseLevel
        }
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
