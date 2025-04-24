import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage extends Document {
  requestId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
  requestId: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema); 