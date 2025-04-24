import React, { useState, useEffect } from 'react';
import { agreementAPI } from '../../services/api';
import { Agreement } from '../../types';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AgreementList: React.FC = () => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        setIsLoading(true);
        const response = await agreementAPI.getAllAgreements();
        setAgreements(response.data);
      } catch (error) {
        console.error('Error fetching agreements:', error);
        setError('Failed to load agreements. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgreements();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
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

  if (agreements.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No agreements found.</p>
        <p className="text-gray-500 mt-2">
          Create service requests or respond to existing ones to start agreements.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Agreements</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {agreements.map((agreement) => (
            <li key={agreement.id}>
              <Link to={`/agreement/${agreement.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(agreement.status)}
                      <p className="ml-2 text-sm font-medium text-indigo-600 truncate">
                        Agreement for Service Request
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${agreement.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          agreement.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                          agreement.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {agreement.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <span className="truncate">
                          {agreement.terms.length > 100 
                            ? `${agreement.terms.substring(0, 100)}...` 
                            : agreement.terms}
                        </span>
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Created: {new Date(agreement.createdAt).toLocaleDateString()}
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

export default AgreementList;