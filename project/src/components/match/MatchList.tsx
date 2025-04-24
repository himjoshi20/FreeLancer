// import React, { useState, useEffect } from 'react';
// import { matchAPI } from '../../services/api';
// import { User } from '../../types';
// import { Search, MessageSquare, Award } from 'lucide-react';

// interface MatchListProps {
//   onStartChat: (userId: string) => void;
// }

// const MatchList: React.FC<MatchListProps> = ({ onStartChat }) => {
//   const [matches, setMatches] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchSkill, setSearchSkill] = useState('');
//   const [isSearching, setIsSearching] = useState(false);

//   useEffect(() => {
//     const fetchMatches = async () => {
//       try {
//         setIsLoading(true);
//         const response = await matchAPI.findMatches();
//         setMatches(response.data);
//       } catch (error) {
//         console.error('Error fetching matches:', error);
//         setError('Failed to load matches. Please try again later.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMatches();
//   }, []);

//   const handleSearch = async () => {
//     if (!searchSkill.trim()) return;
    
//     try {
//       setIsSearching(true);
//       const response = await matchAPI.findBySkill(searchSkill);
//       setMatches(response.data);
//     } catch (error) {
//       console.error('Error searching by skill:', error);
//       setError(`Failed to find users with skill: ${searchSkill}`);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handleReset = async () => {
//     setSearchSkill('');
//     try {
//       setIsLoading(true);
//       const response = await matchAPI.findMatches();
//       setMatches(response.data);
//     } catch (error) {
//       console.error('Error fetching matches:', error);
//       setError('Failed to load matches. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getExpertiseBadgeColor = (level: string) => {
//     switch (level) {
//       case 'Beginner':
//         return 'bg-blue-100 text-blue-800';
//       case 'Intermediate':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'Expert':
//         return 'bg-green-100 text-green-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="w-full p-8 flex justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full p-8">
//         <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
//           <p className="text-sm text-red-700">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-4xl">
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Freelancers</h2>
//         <div className="flex space-x-2">
//           <div className="relative flex-grow">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               value={searchSkill}
//               onChange={(e) => setSearchSkill(e.target.value)}
//               className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               placeholder="Search by skill (e.g., React, Python)"
//             />
//           </div>
//           <button
//             onClick={handleSearch}
//             disabled={isSearching || !searchSkill.trim()}
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//           >
//             {isSearching ? 'Searching...' : 'Search'}
//           </button>
//           {searchSkill && (
//             <button
//               onClick={handleReset}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Reset
//             </button>
//           )}
//         </div>
//       </div>

//       {matches.length === 0 ? (
//         <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
//           <p className="text-gray-500">No matching freelancers found.</p>
//         </div>
//       ) : (
//         <div className="bg-white shadow overflow-hidden sm:rounded-md">
//           <ul className="divide-y divide-gray-200">
//             {matches.map((match) => (
//               <li key={match.id} className="px-6 py-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-900">{match.name}</h3>
//                     <div className="mt-1 flex items-center">
//                       <Award className="h-4 w-4 text-gray-400 mr-1" />
//                       <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getExpertiseBadgeColor(match.expertiseLevel)}`}>
//                         {match.expertiseLevel}
//                       </span>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => onStartChat(match.id)}
//                     className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     <MessageSquare className="h-4 w-4 mr-1" />
//                     Chat
//                   </button>
//                 </div>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500">Skills:</p>
//                   <div className="mt-1 flex flex-wrap gap-2">
//                     {match.skills.map((skill) => (
//                       <span key={skill} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MatchList;

import React, { useState, useEffect } from 'react';
import { matchAPI } from '../../services/api';
import { User } from '../../types';
import { 
  Search, 
  MessageSquare, 
  Award, 
  Filter, 
  UserPlus, 
  X 
} from 'lucide-react';

interface MatchListProps {
  onStartChat: (userId: string) => void;
  searchTerm?: string;
  className?: string;
}

const MatchList: React.FC<MatchListProps> = ({ 
  onStartChat, 
  searchTerm = '',
  className = '' 
}) => {
  const [matches, setMatches] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
  const [expertiseFilter, setExpertiseFilter] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        const response = await matchAPI.findMatches();
        // Ensure matches is always an array
        setMatches(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setError('Failed to load matches. Please try again later.');
        // Set matches to an empty array in case of error
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Filter matches based on search term, skills, and expertise
  const filteredMatches = matches.filter(match => {
    const matchesSearchTerm = !searchTerm || 
      match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkillFilter = filteredSkills.length === 0 || 
      filteredSkills.some(skill => match.skills.includes(skill));
    
    const matchesExpertiseFilter = !expertiseFilter || 
      match.expertiseLevel === expertiseFilter;

    return matchesSearchTerm && matchesSkillFilter && matchesExpertiseFilter;
  });

  const getExpertiseBadgeColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-blue-100 text-blue-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expert':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Collect unique skills from all matches
  const allSkills = Array.from(new Set(matches.flatMap(match => match.skills)));

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

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      {/* Advanced Filtering */}
      <div className="bg-white shadow-soft rounded-2xl p-6 mb-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-indigo-600" />
            Advanced Filters
          </h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Skills Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setFilteredSkills(prev => 
                    prev.includes(skill) 
                      ? prev.filter(s => s !== skill)
                      : [...prev, skill]
                  )}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    filteredSkills.includes(skill)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Expertise Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expertise Level
            </label>
            <select
              value={expertiseFilter}
              onChange={(e) => setExpertiseFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(filteredSkills.length > 0 || expertiseFilter) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilteredSkills([]);
                  setExpertiseFilter('');
                }}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div className="bg-white shadow-soft rounded-2xl p-8 text-center border border-gray-100">
          <UserPlus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No matching freelancers found.</p>
          <p className="text-gray-400 mt-2">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <div 
              key={match.id} 
              className="bg-white shadow-soft rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <UserPlus className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{match.name}</h3>
                  <div className="flex items-center mt-1">
                    <Award className="h-4 w-4 text-gray-400 mr-1" />
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getExpertiseBadgeColor(match.expertiseLevel)}`}>
                      {match.expertiseLevel}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {match.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-2 py-1 bg-indigo-50 text-indigo-800 text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onStartChat(match.id)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchList;