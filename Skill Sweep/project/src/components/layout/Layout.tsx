import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  User, 
  FileText, 
  Users, 
  MessageSquare, 
  FileCheck, 
  LogOut, 
  Menu, 
  X,
  Briefcase
} from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { to: '/dashboard', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { to: '/profile', icon: <User className="h-5 w-5" />, label: 'Profile' },
    { to: '/service', icon: <FileText className="h-5 w-5" />, label: 'Service Requests' },
    { to: '/matches', icon: <Users className="h-5 w-5" />, label: 'Find Matches' },
    { to: '/chats', icon: <MessageSquare className="h-5 w-5" />, label: 'Messages' },
    { to: '/agreements', icon: <FileCheck className="h-5 w-5" />, label: 'Agreements' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Briefcase className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">SkillSwap</span>
              </div>
            </div>
            
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {user && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-4">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75">
            <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl z-50">
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Briefcase className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">SkillSwap</span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-5 px-2 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </NavLink>
                ))}
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-2">
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user?.name}</div>
                      <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-5 w-5 mr-2" />
                        Sign out
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="fixed inset-0" onClick={closeMobileMenu}></div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;