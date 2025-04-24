import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FileText, Users, MessageSquare, FileCheck, Briefcase, ChevronRight } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: 'Service Requests',
      description: 'Create or browse service requests from other freelancers',
      icon: <FileText className="h-8 w-8 text-indigo-600" />,
      link: '/service',
      color: 'bg-blue-50',
    },
    {
      title: 'Find Matches',
      description: 'Discover freelancers with complementary skills',
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      link: '/matches',
      color: 'bg-green-50',
    },
    {
      title: 'Messages',
      description: 'Chat with other freelancers about potential collaborations',
      icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
      link: '/chats',
      color: 'bg-yellow-50',
    },
    {
      title: 'Agreements',
      description: 'Manage your service agreements and track progress',
      icon: <FileCheck className="h-8 w-8 text-indigo-600" />,
      link: '/agreements',
      color: 'bg-purple-50',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-soft rounded-2xl p-6 mb-8 border border-gray-100 transition-all duration-300 hover:shadow-md">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 flex items-center">
          Welcome, {user?.name}! 
          <span className="ml-2 text-indigo-600">👋</span>
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Exchange skills with other freelancers and grow your professional network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`${card.color} p-6 rounded-2xl shadow-soft border border-transparent hover:border-indigo-200 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">{card.icon}</div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {card.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">{card.description}</p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-100 rounded-2xl p-6 shadow-soft">
        <div className="flex items-center mb-4">
          <Briefcase className="h-8 w-8 text-indigo-600" />
          <h2 className="ml-3 text-xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/service/create"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Create Service Request
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl shadow-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Update Your Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;