import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { initializeSocket, disconnectSocket } from './services/socket';

// Layout Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Main Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ServiceRequestsPage from './pages/ServiceRequestsPage';
import ServiceRequestDetailPage from './pages/ServiceRequestDetailPage';
import CreateServiceRequestPage from './pages/CreateServiceRequestPage';
import MatchesPage from './pages/MatchesPage';
import ChatsPage from './pages/ChatsPage';
import AgreementsPage from './pages/AgreementsPage';
import AgreementDetailPage from './pages/AgreementDetailPage';
import SkillMatching from './components/SkillMatching';

// Create a client for React Query
const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Initialize socket connection when user is authenticated
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      if (token) {
        initializeSocket(token);
      }
    }

    // Cleanup socket connection on unmount
    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="service">
          <Route index element={<ServiceRequestsPage />} />
          <Route path="create" element={<CreateServiceRequestPage />} />
          <Route path=":id" element={<ServiceRequestDetailPage />} />
        </Route>
        <Route path="matches" element={<MatchesPage />} />
        <Route path="skill-exchange" element={<SkillMatching />} />
        <Route path="chats" element={<ChatsPage />} />
        <Route path="agreements">
          <Route index element={<AgreementsPage />} />
          <Route path=":id" element={<AgreementDetailPage />} />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;