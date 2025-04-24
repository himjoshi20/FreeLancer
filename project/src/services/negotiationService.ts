import { ServiceRequest, ChatMessage, Negotiation } from '../models/ServiceRequest';

const API_BASE_URL = 'http://localhost:5000/api';

export const createServiceRequest = async (request: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
  const response = await fetch(`${API_BASE_URL}/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(request),
  });
  return response.json();
};

export const getServiceRequests = async () => {
  const response = await fetch(`${API_BASE_URL}/requests`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
};

export const getServiceRequestById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/requests/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
};

export const sendChatMessage = async (requestId: string, message: string, senderId: string) => {
  const response = await fetch(`${API_BASE_URL}/requests/${requestId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ content: message, senderId }),
  });
  return response.json();
};

export const getChatMessages = async (requestId: string) => {
  const response = await fetch(`${API_BASE_URL}/requests/${requestId}/messages`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
};

export const updateRequestStatus = async (requestId: string, status: ServiceRequest['status']) => {
  const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ status }),
  });
  return response.json();
};

export const makeOffer = async (requestId: string, offer: number) => {
  const response = await fetch(`${API_BASE_URL}/requests/${requestId}/offer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ offer }),
  });
  return response.json();
}; 