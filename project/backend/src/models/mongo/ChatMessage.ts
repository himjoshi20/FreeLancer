import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  requestId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

const ChatMessageSchema: Schema = new Schema({
  requestId: { type: String, required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema); 