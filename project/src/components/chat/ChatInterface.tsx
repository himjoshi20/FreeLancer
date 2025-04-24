import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../../services/api';
import { Message, User } from '../../types';
import { Send, ArrowLeft } from 'lucide-react';
import { getSocket } from '../../services/socket';
import { useAuth } from '../../hooks/useAuth';

interface ChatInterfaceProps {
  chatId: string;
  receiver: User;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId, receiver, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await chatAPI.getMessages(chatId);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Set up socket listener for new messages
    const socket = getSocket();
    
    socket.on('new_message', (message: Message) => {
      if (message.senderId === receiver.id || message.receiverId === receiver.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('new_message');
    };
  }, [chatId, receiver.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    try {
      await chatAPI.sendMessage(receiver.id, newMessage);
      setNewMessage('');
      
      // The new message will be added via the socket listener
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button
          onClick={onBack}
          className="mr-3 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-lg font-medium text-gray-900">{receiver.name}</h2>
          <p className="text-sm text-gray-500">{receiver.expertiseLevel}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === user?.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === user?.id ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Type your message..."
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;