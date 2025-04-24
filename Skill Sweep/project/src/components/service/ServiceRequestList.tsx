import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../../services/api';
import { ServiceRequest } from '../../types';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceRequestList: React.FC = () => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setIsLoading(true);
        const response = await serviceAPI.getAllRequests();
        setServiceRequests(response.data);
      } catch (error) {
        console.error('Error fetching service requests:', error);
        setError('Failed to load service requests. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceRequests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'In Progress':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

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

  if (serviceRequests.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">No service requests found.</p>
        <Link
          to="/service/create"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create a Service Request
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Requests</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {serviceRequests.map((request) => (
            <li key={request.id}>
              <Link to={`/service/${request.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(request.status)}
                      <p className="ml-2 text-sm font-medium text-indigo-600 truncate">
                        {request.serviceDetails}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${request.status === 'Open' ? 'bg-blue-100 text-blue-800' : 
                          request.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                          request.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {request.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Skills required:
                        <span className="ml-1 font-medium">
                          {request.skillsRequired.join(', ')}
                        </span>
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Created: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceRequestList;