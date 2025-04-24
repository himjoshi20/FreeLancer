import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { User, AuthContextType, RegisterFormData, UpdateProfileData } from '../types';
import { Navigate, useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set the auth token for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user data
          const response = await axios.get('http://localhost:5000/api/profile/me');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterFormData) => {
    try {
      setIsLoading(true);
      await axios.post('http://localhost:5000/api/auth/register', userData);
      // After registration, user needs to verify OTP
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string,navigate: ReturnType<typeof useNavigate>) => {
    try {
      setIsLoading(true);
      await axios.post('http://localhost:5000/api/auth/verify', { email, otp });
      navigate('/login');
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: UpdateProfileData) => {
    try {
      setIsLoading(true);
      const response = await axios.put('http://localhost:5000/api/profile/update', userData);
      setUser(response.data);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        verifyOtp,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};