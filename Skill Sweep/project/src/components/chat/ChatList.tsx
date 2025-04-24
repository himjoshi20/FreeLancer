import React, { useState, useEffect } from 'react';
import { chatAPI } from '../../services/api';
import { Chat, User } from '../../types';
import { MessageSquare } from 'lucide-react';

interface ChatListProps {
  onSelectChat: (chatId: string, receiver: User) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const [chats, setChats] = useState<{ chat: Chat; receiver: User }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        // This would be a custom endpoint that returns chats with user details
        const response = await chatAPI.getAllChats();
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError('Failed to load chats. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8">
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No conversations yet.</p>
        <p className="text-gray-500 mt-2">
          Start chatting with freelancers from the Matches page.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Conversations</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {chats.map(({ chat, receiver }) => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            
            return (
              <li key={chat.id}>
                <button
                  onClick={() => onSelectChat(chat.id, receiver)}
                  className="w-full block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-indigo-600 truncate text-left">
                        {receiver.name}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {receiver.expertiseLevel}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <p className="truncate">
                          {lastMessage ? lastMessage.text : 'No messages yet'}
                        </p>
                      </div>
                      {lastMessage && (
                        <div className="text-xs text-gray-500">
                          {new Date(lastMessage.timestamp).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;