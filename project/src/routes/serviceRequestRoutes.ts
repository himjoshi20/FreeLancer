import express from 'express';
import { authenticateToken } from '../middleware/auth';
import ServiceRequest from '../models/mongo/ServiceRequest';
import ChatMessage from '../models/mongo/ChatMessage';

const router = express.Router();

// Create a new service request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const request = new ServiceRequest({
      ...req.body,
      requesterId: req.user.id,
      status: 'pending'
    });
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create service request' });
  }
});

// Get all service requests
router.get('/', authenticateToken, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      $or: [
        { requesterId: req.user.id },
        { providerId: req.user.id }
      ]
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service requests' });
  }
});

// Get a specific service request
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Service request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service request' });
  }
});

// Update service request status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Only the requester or provider can update the status
    if (request.requesterId !== req.user.id && request.providerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this request' });
    }

    request.status = req.body.status;
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service request status' });
  }
});

// Get chat messages for a service request
router.get('/:id/messages', authenticateToken, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Only the requester or provider can view messages
    if (request.requesterId !== req.user.id && request.providerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view these messages' });
    }

    const messages = await ChatMessage.find({ requestId: req.params.id })
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
});

// Send a chat message
router.post('/:id/messages', authenticateToken, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Only the requester or provider can send messages
    if (request.requesterId !== req.user.id && request.providerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to send messages' });
    }

    const message = new ChatMessage({
      requestId: req.params.id,
      senderId: req.user.id,
      content: req.body.content
    });
    await message.save();

    // Update request status to negotiating if it's pending
    if (request.status === 'pending') {
      request.status = 'negotiating';
      await request.save();
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router; 