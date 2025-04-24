import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceRequestDetail from '../components/service/ServiceRequestDetail';

const ServiceRequestDetailPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleStartChat = (userId: string) => {
    // In a real app, this would create a chat if it doesn't exist
    // and then navigate to the chat page
    navigate(`/chats?userId=${userId}`);
  };

  return (
    <div className="flex justify-center">
      <ServiceRequestDetail onStartChat={handleStartChat} />
    </div>
  );
};

export default ServiceRequestDetailPage;