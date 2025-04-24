// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import MatchList from '../components/match/MatchList';

// const MatchesPage: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleStartChat = (userId: string) => {
//     // In a real app, this would create a chat if it doesn't exist
//     // and then navigate to the chat page
//     navigate(`/chats?userId=${userId}`);
//   };

//   return (
//     <div className="flex justify-center">
//       <MatchList onStartChat={handleStartChat} />
//     </div>
//   );
// };

// export default MatchesPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MessageCircle, 
  Star, 
  ArrowRight 
} from 'lucide-react';
import MatchList from '../components/match/MatchList';

const MatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  
  const handleStartChat = (userId: string) => {
    // In a real app, this would create a chat if it doesn't exist
    // and then navigate to the chat page
    navigate(`/chats?userId=${userId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-soft rounded-2xl p-6 mb-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Star className="h-8 w-8 mr-3 text-indigo-600" />
            Find Your Perfect Match
          </h1>
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <Filter className="h-6 w-6" />
          </button>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search matches by skills, name, or expertise"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {filterOpen && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Skills</label>
              <select 
                multiple 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option>React</option>
                <option>Node.js</option>
                <option>Python</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expertise Level</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input 
                type="text" 
                placeholder="City or Remote"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <MatchList 
        onStartChat={handleStartChat} 
        searchTerm={searchTerm}
        className="transform transition-all duration-300 hover:scale-[1.01]"
      />
    </div>
  );
};

export default MatchesPage;