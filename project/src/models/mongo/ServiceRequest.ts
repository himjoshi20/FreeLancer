import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceRequest extends Document {
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: Date;
  status: 'pending' | 'negotiating' | 'accepted' | 'rejected' | 'completed';
  requesterId: string;
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceRequestSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'negotiating', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  requesterId: { type: String, required: true },
  providerId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
ServiceRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IServiceRequest>('ServiceRequest', ServiceRequestSchema); 