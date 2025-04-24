import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export const authenticateSocket = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
    socket.data.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
}; 