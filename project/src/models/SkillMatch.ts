import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  skills: ISkill[];
  lookingFor: ISkill[];
  matches: mongoose.Types.ObjectId[];
}

const skillSchema = new Schema<ISkill>({
  name: { type: String, required: true, index: true },
  category: { type: String, required: true }
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skills: [skillSchema],
  lookingFor: [skillSchema],
  matches: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

// Create indexes for efficient matching
userSchema.index({ 'skills.name': 1 });
userSchema.index({ 'lookingFor.name': 1 });

export const User = mongoose.model<IUser>('User', userSchema); 