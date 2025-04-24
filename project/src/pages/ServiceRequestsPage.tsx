import React, { useState, useEffect } from 'react';
import ServiceRequestForm from '../components/ServiceRequestForm';
import NegotiationChat from '../components/NegotiationChat';
import {
  createServiceRequest,
  getServiceRequests,
  sendChatMessage,
  getChatMessages,
  updateRequestStatus,
} from '../services/negotiationService';
import { ServiceRequest, ChatMessage } from '../models/ServiceRequest';
import { useAuth } from '../hooks/useAuth';

const ServiceRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    if (selectedRequest) {
      loadMessages(selectedRequest.id);
    }
  }, [selectedRequest]);

  const loadRequests = async () => {
    const data = await getServiceRequests();
    setRequests(data);
  };

  const loadMessages = async (requestId: string) => {
    const data = await getChatMessages(requestId);
    setMessages(data);
  };

  const handleSubmitRequest = async (request: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    await createServiceRequest(request);
    loadRequests();
    setShowForm(false);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedRequest || !user) return;
    
    await sendChatMessage(selectedRequest.id, message, user.id);
    loadMessages(selectedRequest.id);
  };

  const handleRequestClick = (request: ServiceRequest) => {
    setSelectedRequest(request);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Service Requests & Negotiations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          {showForm ? 'Cancel' : 'Create New Request'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {showForm ? (
            <ServiceRequestForm onSubmit={handleSubmitRequest} />
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Your Requests</h2>
              {requests.map((request) => (
                <div
                  key={request.id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedRequest?.id === request.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleRequestClick(request)}
                >
                  <h3 className="font-semibold">{request.title}</h3>
                  <p className="text-sm text-gray-600">{request.description}</p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>Budget: ${request.budget}</span>
                    <span className={`px-2 py-1 rounded ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'negotiating' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {selectedRequest ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">Negotiation Chat</h2>
              <NegotiationChat
                requestId={selectedRequest.id}
                currentUserId={user?.id || ''}
                onSendMessage={handleSendMessage}
                messages={messages}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a request to start negotiation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestsPage;