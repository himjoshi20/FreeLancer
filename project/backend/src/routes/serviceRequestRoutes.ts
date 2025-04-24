import express from 'express';
import ServiceRequest from '../models/mongo/ServiceRequest';
import ChatMessage from '../models/mongo/ChatMessage';

const router = express.Router();

// Create a new service request
router.post('/', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    const request = new ServiceRequest({
      ...req.body,
      requesterId: req.body.requesterId || 'default-user-id', // This should come from auth
      status: 'pending'
    });
    const savedRequest = await request.save();
    console.log('Saved request:', savedRequest);
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Error creating service request:', error);
    res.status(400).json({ error: 'Failed to create service request' });
  }
});

// Get all service requests
router.get('/', async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching service requests:', error);
    res.status(500).json({ error: 'Failed to fetch service requests' });
  }
});

// Get a specific service request
router.get('/:id', async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Service request not found' });
    }
    res.json(request);
  } catch (error) {
    console.error('Error fetching service request:', error);
    res.status(500).json({ error: 'Failed to fetch service request' });
  }
});

// Update service request status
router.patch('/:id/status', async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    request.status = req.body.status;
    await request.save();
    res.json(request);
  } catch (error) {
    console.error('Error updating service request status:', error);
    res.status(500).json({ error: 'Failed to update service request status' });
  }
});

// Get chat messages for a service request
router.get('/:id/messages', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ requestId: req.params.id })
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
});

// Send a chat message
router.post('/:id/messages', async (req, res) => {
  try {
    const message = new ChatMessage({
      requestId: req.params.id,
      senderId: req.body.senderId || 'default-user-id', // This should come from auth
      content: req.body.content
    });
    await message.save();

    // Update request status to negotiating if it's pending
    const request = await ServiceRequest.findById(req.params.id);
    if (request && request.status === 'pending') {
      request.status = 'negotiating';
      await request.save();
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending chat message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router; 