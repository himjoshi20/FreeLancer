import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { authenticateSocket } from '../middleware/socketAuth';
import ChatMessage from '../models/mongo/ChatMessage';

let io: Server;

export const initializeWebSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // Socket middleware for authentication
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a room for a specific service request
    socket.on('join-request', (requestId: string) => {
      socket.join(`request-${requestId}`);
      console.log(`User ${socket.id} joined request-${requestId}`);
    });

    // Leave a room for a specific service request
    socket.on('leave-request', (requestId: string) => {
      socket.leave(`request-${requestId}`);
      console.log(`User ${socket.id} left request-${requestId}`);
    });

    // Handle new chat messages
    socket.on('new-message', async (data: { requestId: string; content: string; senderId: string }) => {
      try {
        // Save message to database
        const message = new ChatMessage({
          requestId: data.requestId,
          senderId: data.senderId,
          content: data.content
        });
        await message.save();

        // Broadcast the message to all users in the request room
        io.to(`request-${data.requestId}`).emit('message-received', message);
      } catch (error) {
        console.error('Error handling new message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}; 