import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceAPI, agreementAPI } from '../../services/api';
import { ServiceRequest, User } from '../../types';
import { Clock, CheckCircle, AlertCircle, XCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ServiceRequestDetailProps {
  onStartChat: (userId: string) => void;
}

const ServiceRequestDetail: React.FC<ServiceRequestDetailProps> = ({ onStartChat }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [requestOwner, setRequestOwner] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [agreementTerms, setAgreementTerms] = useState('');
  const [showAgreementForm, setShowAgreementForm] = useState(false);

  useEffect(() => {
    const fetchServiceRequest = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        // This would be a custom endpoint that returns both the service request and its owner
        const response = await serviceAPI.getRequestById(id);
        setServiceRequest(response.data.serviceRequest);
        setRequestOwner(response.data.owner);
      } catch (error) {
        console.error('Error fetching service request:', error);
        setError('Failed to load service request details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceRequest();
  }, [id]);

  const handleStatusUpdate = async (status: string) => {
    if (!id || !serviceRequest) return;
    
    try {
      setIsUpdating(true);
      await serviceAPI.updateRequestStatus(id, status);
      
      // Update the local state
      setServiceRequest({
        ...serviceRequest,
        status,
      });
    } catch (error) {
      console.error('Error updating service request status:', error);
      setError('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateAgreement = async () => {
    if (!id || !serviceRequest || !user) return;
    
    try {
      setIsUpdating(true);
      
      await agreementAPI.createAgreement({
        serviceRequest: id,
        partiesInvolved: [user.id, serviceRequest.userId],
        terms: agreementTerms,
      });
      
      // Navigate to agreements page or show success message
      navigate('/agreements');
    } catch (error) {
      console.error('Error creating agreement:', error);
      setError('Failed to create agreement. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <Clock className="h-6 w-6 text-blue-500" />;
      case 'In Progress':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      case 'Completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
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

  if (!serviceRequest) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">Service request not found.</p>
      </div>
    );
  }

  const isOwner = user?.id === serviceRequest.userId;

  return (
    <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {getStatusIcon(serviceRequest.status)}
          <h1 className="ml-2 text-2xl font-bold text-gray-900">Service Request Details</h1>
        </div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full 
          ${serviceRequest.status === 'Open' ? 'bg-blue-100 text-blue-800' : 
            serviceRequest.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
            serviceRequest.status === 'Completed' ? 'bg-green-100 text-green-800' : 
            'bg-red-100 text-red-800'}`}
        >
          {serviceRequest.status}
        </span>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <dl className="divide-y divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Service Details</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {serviceRequest.serviceDetails}
            </dd>
          </div>
          
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Skills Required</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="flex flex-wrap gap-2">
                {serviceRequest.skillsRequired.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </dd>
          </div>
          
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Posted By</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {requestOwner ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{requestOwner.name}</p>
                    <p className="text-gray-500">{requestOwner.expertiseLevel}</p>
                  </div>
                  {!isOwner && (
                    <button
                      onClick={() => onStartChat(requestOwner.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Chat
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Unknown</p>
              )}
            </dd>
          </div>
          
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {new Date(serviceRequest.createdAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>

      {isOwner && serviceRequest.status === 'Open' && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900">Manage Request</h2>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => handleStatusUpdate('In Progress')}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              Mark as In Progress
            </button>
            <button
              onClick={() => handleStatusUpdate('Cancelled')}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Cancel Request
            </button>
          </div>
        </div>
      )}

      {isOwner && serviceRequest.status === 'In Progress' && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900">Manage Request</h2>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => handleStatusUpdate('Completed')}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              Mark as Completed
            </button>
            <button
              onClick={() => handleStatusUpdate('Cancelled')}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Cancel Request
            </button>
          </div>
        </div>
      )}

      {!isOwner && serviceRequest.status === 'Open' && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900">Interested in this request?</h2>
          <div className="mt-4">
            <button
              onClick={() => setShowAgreementForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Propose Agreement
            </button>
          </div>
        </div>
      )}

      {showAgreementForm && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900">Propose Agreement</h2>
          <div className="mt-4">
            <label htmlFor="terms" className="block text-sm font-medium text-gray-700">
              Agreement Terms
            </label>
            <textarea
              id="terms"
              rows={4}
              value={agreementTerms}
              onChange={(e) => setAgreementTerms(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe the terms of your agreement..."
            />
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleCreateAgreement}
                disabled={isUpdating || !agreementTerms.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isUpdating ? 'Submitting...' : 'Submit Proposal'}
              </button>
              <button
                onClick={() => setShowAgreementForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequestDetail;