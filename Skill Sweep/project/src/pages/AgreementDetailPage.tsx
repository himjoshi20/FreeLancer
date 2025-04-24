import React from 'react';
import { useNavigate } from 'react-router-dom';
import AgreementDetail from '../components/agreement/AgreementDetail';

const AgreementDetailPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleStartChat = (userId: string) => {
    // In a real app, this would create a chat if it doesn't exist
    // and then navigate to the chat page
    navigate(`/chats?userId=${userId}`);
  };

  return (
    <div className="flex justify-center">
      <AgreementDetail onStartChat={handleStartChat} />
    </div>
  );
};

export default AgreementDetailPage;