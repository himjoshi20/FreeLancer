import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  requestId: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

const ChatMessageSchema: Schema = new Schema({
  requestId: { type: String, required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Create an index for faster querying of messages by requestId
ChatMessageSchema.index({ requestId: 1, timestamp: 1 });

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema); 