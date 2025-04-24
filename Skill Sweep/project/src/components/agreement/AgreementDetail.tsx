import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { agreementAPI, serviceAPI } from '../../services/api';
import { Agreement, ServiceRequest, User } from '../../types';
import { FileText, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AgreementDetailProps {
  onStartChat: (userId: string) => void;
}

const AgreementDetail: React.FC<AgreementDetailProps> = ({ onStartChat }) => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [parties, setParties] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchAgreementDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        // This would be a custom endpoint that returns the agreement, related service request, and parties involved
        const response = await agreementAPI.getAgreementById(id);
        setAgreement(response.data.agreement);
        setServiceRequest(response.data.serviceRequest);
        setParties(response.data.parties);
      } catch (error) {
        console.error('Error fetching agreement details:', error);
        setError('Failed to load agreement details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgreementDetails();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    if (!id || !agreement) return;
    
    try {
      setIsUpdating(true);
      await agreementAPI.updateAgreementStatus(id, status);
      
      // Update the local state
      setAgreement({
        ...agreement,
        status,
      });
    } catch (error) {
      console.error('Error updating agreement status:', error);
      setError('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'Accepted':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'Rejected':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'Completed':
        return <CheckCircle className="h-6 w-6 text-blue-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
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

  if (!agreement) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">Agreement not found.</p>
      </div>
    );
  }

  // Check if the current user is the recipient of the agreement proposal
  const isRecipient = user && agreement.partiesInvolved.includes(user.id) && 
                      serviceRequest && serviceRequest.userId !== user.id;

  return (
    <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {getStatusIcon(agreement.status)}
          <h1 className="ml-2 text-2xl font-bold text-gray-900">Agreement Details</h1>
        </div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full 
          ${agreement.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
            agreement.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
            agreement.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
            'bg-red-100 text-red-800'}`}
        >
          {agreement.status}
        </span>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <dl className="divide-y divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Agreement Terms</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {agreement.terms}
            </dd>
          </div>
          
          {serviceRequest && (
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Related Service Request</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div>
                  <p className="font-medium">{serviceRequest.serviceDetails}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {serviceRequest.skillsRequired.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </dd>
            </div>
          )}
          
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Parties Involved</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <ul className="divide-y divide-gray-200">
                {parties.map((party) => (
                  <li key={party.id} className="py-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{party.name}</p>
                      <p className="text-gray-500">{party.expertiseLevel}</p>
                    </div>
                    {user?.id !== party.id && (
                      <button
                        onClick={() => onStartChat(party.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Chat
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {new Date(agreement.createdAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>

      {isRecipient && agreement.status === 'Pending' && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900">Respond to Agreement</h2>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => handleUpdateStatus('Accepted')}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              Accept Agreement
            </button>
            <button
              onClick={() => handleUpdateStatus('Rejected')}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Reject Agreement
            </button>
          </div>
        </div>
      )}

      {agreement.status === 'Accepted' && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900">Agreement Status</h2>
          <div className="mt-4">
            <button
              onClick={() => handleUpdateStatus('Completed')}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Mark as Completed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgreementDetail;