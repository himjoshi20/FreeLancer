import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatList from '../components/chat/ChatList';
import ChatInterface from '../components/chat/ChatInterface';
import { User } from '../types';

const ChatsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialUserId = queryParams.get('userId');
  
  const [selectedChat, setSelectedChat] = useState<{ chatId: string; receiver: User } | null>(null);
  const [showChatList, setShowChatList] = useState(!initialUserId);

  useEffect(() => {
    // If a userId is provided in the URL, we would fetch the chat or create a new one
    if (initialUserId) {
      // This is a simplified example. In a real app, you would:
      // 1. Check if a chat exists with this user
      // 2. If not, create a new chat
      // 3. Then set the selectedChat state
      
      // For now, we'll just simulate this with mock data
      const mockUser: User = {
        id: initialUserId,
        name: 'User from URL',
        email: 'user@example.com',
        skills: ['React', 'Node.js'],
        expertiseLevel: 'Intermediate'
      };
      
      setSelectedChat({
        chatId: `mock-chat-${initialUserId}`,
        receiver: mockUser
      });
      
      setShowChatList(false);
    }
  }, [initialUserId]);

  const handleSelectChat = (chatId: string, receiver: User) => {
    setSelectedChat({ chatId, receiver });
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setShowChatList(true);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden h-[calc(100vh-12rem)]">
      {showChatList || !selectedChat ? (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
          <ChatList onSelectChat={handleSelectChat} />
        </div>
      ) : (
        <ChatInterface 
          chatId={selectedChat.chatId} 
          receiver={selectedChat.receiver} 
          onBack={handleBackToList} 
        />
      )}
    </div>
  );
};

export default ChatsPage;