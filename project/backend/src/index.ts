import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { ChatMessage } from './models/ChatMessage';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skill-sweep')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Chat Message Routes
app.post('/api/chat-messages', async (req, res) => {
  try {
    const { requestId, senderId, content } = req.body;
    const message = new ChatMessage({ requestId, senderId, content });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat message' });
  }
});

app.get('/api/chat-messages/:requestId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ requestId: req.params.requestId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 