// import React from 'react';
// import ProfileForm from '../components/profile/ProfileForm';

// const ProfilePage: React.FC = () => {
//   return (
//     <div className="flex justify-center">
//       <ProfileForm />
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProfileForm from '../components/profile/ProfileForm';
import { 
  User, 
  Mail, 
  Star, 
  Code, 
  Calendar, 
  Edit, 
  CheckCircle 
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!isEditing ? (
        <div className="bg-white shadow-soft rounded-2xl p-8 relative">
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 bg-indigo-50 text-indigo-600 p-2 rounded-full hover:bg-indigo-100 transition-colors"
          >
            <Edit className="h-6 w-6" />
          </button>
          
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="h-12 w-12 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-gray-600">{profile.email}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Code className="h-5 w-5 mr-2 text-indigo-600" />
                <h3 className="font-semibold text-gray-800">Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string) => (
                  <span 
                    key={skill} 
                    className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Star className="h-5 w-5 mr-2 text-indigo-600" />
                <h3 className="font-semibold text-gray-800">Expertise Level</h3>
              </div>
              <p className="text-gray-700">{profile.expertiseLevel}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                <h3 className="font-semibold text-gray-800">Account Created</h3>
              </div>
              <p className="text-gray-700">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                <h3 className="font-semibold text-gray-800">Account Status</h3>
              </div>
              <p className={`font-medium ${profile.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                {profile.isVerified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <ProfileForm/>
      )}
    </div>
  );
};

export default ProfilePage;