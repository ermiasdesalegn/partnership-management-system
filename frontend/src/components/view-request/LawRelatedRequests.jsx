import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaForward, FaFileAlt, FaDownload } from 'react-icons/fa';
import { fetchLawRelatedRequests, forwardToGeneralDirector } from '../../api/adminApi';

const LawRelatedRequests = () => {
  const [activeTab, setActiveTab] = useState('approved');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['lawRelatedRequests'],
    queryFn: fetchLawRelatedRequests
  });

  const forwardMutation = useMutation({
    mutationFn: forwardToGeneralDirector,
    onSuccess: () => {
      toast.success('Request forwarded to General Director successfully');
      queryClient.invalidateQueries(['lawRelatedRequests']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to forward request');
    }
  });

  const handleForward = (requestId) => {
    if (window.confirm('Are you sure you want to forward this request to the General Director?')) {
      forwardMutation.mutate(requestId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error.message}
        </div>
      </div>
    );
  }

  const { approved, disapproved } = data || { approved: [], disapproved: [] };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Law-Related Requests</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('approved')}
              className={`${
                activeTab === 'approved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Approved ({approved.length})
            </button>
            <button
              onClick={() => setActiveTab('disapproved')}
              className={`${
                activeTab === 'disapproved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Disapproved ({disapproved.length})
            </button>
          </nav>
        </div>

        {/* Request List */}
        <div className="space-y-6">
          {(activeTab === 'approved' ? approved : disapproved).map((request) => (
            <div key={request._id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {request.companyDetails?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted by: {request.userRef?.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {activeTab === 'approved' && (
                      <button
                        onClick={() => handleForward(request._id)}
                        disabled={forwardMutation.isLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaForward className="mr-2" />
                        Forward to General Director
                      </button>
                    )}
                  </div>
                </div>

                {/* Law Department Response */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Law Department Response</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.lawDepartmentResponse.decision === 'approve'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {request.lawDepartmentResponse.decision === 'approve' ? (
                          <FaCheckCircle className="mr-1" />
                        ) : (
                          <FaTimesCircle className="mr-1" />
                        )}
                        {request.lawDepartmentResponse.decision.toUpperCase()}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        Reviewed by {request.lawDepartmentResponse.reviewedBy.name} on{' '}
                        {new Date(request.lawDepartmentResponse.date).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Internal Notes */}
                    {request.lawDepartmentResponse.message && (
                      <div className="mt-2">
                        <h5 className="text-xs font-medium text-gray-500">Internal Notes</h5>
                        <p className="mt-1 text-sm text-gray-900">{request.lawDepartmentResponse.message}</p>
                      </div>
                    )}

                    {/* Feedback for Requester */}
                    {request.lawDepartmentResponse.feedbackMessage && (
                      <div className="mt-2">
                        <h5 className="text-xs font-medium text-gray-500">Feedback for Requester</h5>
                        <p className="mt-1 text-sm text-gray-900">{request.lawDepartmentResponse.feedbackMessage}</p>
                      </div>
                    )}

                    {/* Attachments */}
                    {(request.lawDepartmentResponse.attachments?.length > 0 || 
                      request.lawDepartmentResponse.feedbackAttachments?.length > 0) && (
                      <div className="mt-4">
                        <h5 className="text-xs font-medium text-gray-500 mb-2">Attachments</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {request.lawDepartmentResponse.attachments?.map((attachment, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-white p-2 rounded border">
                              <FaFileAlt className="text-gray-400" />
                              <span className="text-sm text-gray-600 truncate">
                                {attachment.split('/').pop()}
                              </span>
                              <a
                                href={`http://localhost:5000/api/v1/files/${attachment}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto text-gray-400 hover:text-gray-600"
                              >
                                <FaDownload />
                              </a>
                            </div>
                          ))}
                          {request.lawDepartmentResponse.feedbackAttachments?.map((attachment, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-white p-2 rounded border">
                              <FaFileAlt className="text-gray-400" />
                              <span className="text-sm text-gray-600 truncate">
                                {attachment.split('/').pop()}
                              </span>
                              <a
                                href={`http://localhost:5000/api/v1/files/${attachment}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto text-gray-400 hover:text-gray-600"
                              >
                                <FaDownload />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(activeTab === 'approved' ? approved : disapproved).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No {activeTab} law-related requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawRelatedRequests; 