import axios from 'axios';
import { 
  CreateServiceRequestData, 
  CreateAgreementData, 
  UpdateProfileData 
} from '../types';

// Configure axios defaults
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData: any) => axios.post('http://localhost:5000/api/auth/register', userData),
  verifyOtp: (email: string, otp: string) => axios.post('http://localhost:5000/api/auth/verify', { email, otp }),
  login: (email: string, password: string) => axios.post('http://localhost:5000/api/auth/login', { email, password }),
};

// User API
export const userAPI = {
  getProfile: () => axios.get('http://localhost:5000/api/profile/me'),
  updateProfile: (data: UpdateProfileData) => axios.put('http://localhost:5000/api/profile/update', data),
  uploadPortfolio: (file: File) => {
    const formData = new FormData();
    formData.append('portfolio', file);
    return axios.post('http://localhost:5000/api/profile/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Match API
export const matchAPI = {
  findMatches: () => axios.get('http://localhost:5000/api/match/find-matches'),
  findBySkill: (skill: string) => axios.get(`http://localhost:5000/api/match/find-by-skill/${skill}`),
};

// Service Request API
export const serviceAPI = {
  createRequest: (data: CreateServiceRequestData) => axios.post('http://localhost:5000/api/service/create', data),
  getAllRequests: () => axios.get('http://localhost:5000/api/service/all'),
  getRequestById: (id: string) => axios.get(`http://localhost:5000/api/service/${id}`),
  updateRequestStatus: (id: string, status: string) => 
    axios.put(`http://localhost:5000/api/service/update/${id}`, { status }),
};

// Chat API
export const chatAPI = {
  getAllChats: () => axios.get('http://localhost:5000/api/chat/all'),
  sendMessage: (receiverId: string, text: string) => 
    axios.post('/api/chat/send', { receiverId, text }),
  getMessages: (chatId: string) => axios.get(`http://localhost:5000/api/chat/get/${chatId}`),
};

// Agreement API
export const agreementAPI = {
  getAllAgreements: () => axios.get('http://localhost:5000/api/agreement/all'),
  getAgreementById: (id: string) => axios.get(`http://localhost:5000/api/agreement/${id}`),
  createAgreement: (data: CreateAgreementData) => 
    axios.post('http://localhost:5000/api/agreement/create', data),
  updateAgreementStatus: (id: string, status: string) => 
    axios.put(`http://localhost:5000/api/agreement/update/${id}`, { status }),
};