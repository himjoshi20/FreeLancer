export interface ServiceRequest {
  id: string;
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

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export interface Negotiation {
  requestId: string;
  messages: ChatMessage[];
  currentOffer?: number;
  status: 'active' | 'accepted' | 'rejected';
} 