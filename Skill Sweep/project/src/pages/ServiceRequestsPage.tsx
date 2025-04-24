import React from 'react';
import { Link } from 'react-router-dom';
import ServiceRequestList from '../components/service/ServiceRequestList';
import { PlusCircle } from 'lucide-react';

const ServiceRequestsPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
        <Link
          to="/service/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create Request
        </Link>
      </div>
      <ServiceRequestList />
    </div>
  );
};

export default ServiceRequestsPage;