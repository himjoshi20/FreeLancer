import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface User {
  id: string;
  name: string;
  skills: Skill[];
  lookingFor: Skill[];
}

const SkillMatching: React.FC = () => {
  const [socket, setSocket] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<User[]>([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('matchFound', (matchedUser: User) => {
      setMatches(prev => [...prev, matchedUser]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleSkillAdd = (skill: Skill, isOffering: boolean) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      [isOffering ? 'skills' : 'lookingFor']: [
        ...currentUser[isOffering ? 'skills' : 'lookingFor'],
        skill
      ]
    };
    
    setCurrentUser(updatedUser);
    socket?.emit('updateUser', updatedUser);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Your Skills</h2>
          <div className="space-y-4">
            {currentUser?.skills.map(skill => (
              <div key={skill.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                <span>{skill.name}</span>
                <button className="text-red-500">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Skills You're Looking For</h2>
          <div className="space-y-4">
            {currentUser?.lookingFor.map(skill => (
              <div key={skill.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                <span>{skill.name}</span>
                <button className="text-red-500">Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Potential Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {matches.map(match => (
            <div key={match.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold">{match.name}</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600">Offers:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {match.skills.map(skill => (
                    <span key={skill.id} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillMatching; 