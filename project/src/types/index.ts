import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  name: string;
  email: string;
  skills: string[];
  expertiseLevel: 'Beginner' | 'Intermediate' | 'Expert';
  portfolio?: string[];
}

export interface ServiceRequest {
  id: string;
  userId: string;
  serviceDetails: string;
  skillsRequired: string[];
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
}

export interface Agreement {
  id: string;
  serviceRequest: string;
  partiesInvolved: string[];
  terms: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  verifyOtp: (email: string, otp: string, navigate: ReturnType<typeof useNavigate>) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: UpdateProfileData) => Promise<void>;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  skills: string[];
  expertiseLevel: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  skills?: string[];
  expertiseLevel?: string;
}

export interface OtpVerificationData {
  email: string;
  otp: string;
}

export interface CreateServiceRequestData {
  serviceDetails: string;
  skillsRequired: string[];
}

export interface CreateAgreementData {
  serviceRequest: string;
  partiesInvolved: string[];
  terms: string;
}