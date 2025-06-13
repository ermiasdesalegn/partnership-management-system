import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spinner } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { fetchRequestDetails } from '../../api/userApi';
import { 
  DocumentIcon, 
  CalendarIcon, 
  BuildingOfficeIcon, 
  ArrowLeftIcon, 
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { 
    data: requestData, 
    isLoading, 
    error, 
    isError 
  } = useQuery({
    queryKey: ['requestDetails', id],
    queryFn: () => fetchRequestDetails(id),
    enabled: !!id,
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to fetch request details');
      if (error.response?.status === 401) {
          navigate('/internal/login');
      }
          }
        });

  const request = requestData?.data?.request;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <DocumentCheckIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner className="h-12 w-12 mb-4" />
          <Typography color="gray">Loading request details...</Typography>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <Typography variant="h4" color="red" className="mb-4">
            Error
          </Typography>
          <Typography color="gray" className="mb-4">
            {error?.response?.data?.message || error?.message || 'Failed to load request details'}
          </Typography>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/internal/dashboard')} variant="outlined">
              Back to Dashboard
            </Button>
            <Button onClick={() => window.location.reload()} color="blue">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <Typography variant="h4" color="gray" className="mb-4">
            Request Not Found
          </Typography>
          <Typography color="gray" className="mb-4">
            The requested details could not be found.
          </Typography>
          <Button onClick={() => navigate('/internal/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={() => navigate('/internal/dashboard')}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Dashboard
          </Button>
          <Typography variant="h2" color="blue-gray">
            Request Details
          </Typography>
        </div>

        {/* Status Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small" color="blue-gray">
                Request Status
              </Typography>
              <Typography variant="h4" color="blue-gray">
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Typography>
            </div>
            {getStatusIcon(request.status)}
          </div>
          <div className="mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
              {request.status}
            </span>
          </div>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timeline */}
          <Card className="p-6">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Timeline
            </Typography>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <CalendarIcon className="h-6 w-6 text-blue-500" />
                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Submitted
                  </Typography>
                  <Typography variant="small" color="gray">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
              </div>
            </div>
          </Card>

          {/* Framework Details */}
          <Card className="p-6">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Framework Details
            </Typography>
            <div className="space-y-4">
              <div>
                <Typography variant="small" color="blue-gray">
                  Type
                </Typography>
                <Typography variant="paragraph" color="blue-gray">
                  {request.frameworkType}
                </Typography>
              </div>
              <div className="mb-4">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Duration
                </Typography>
                <Typography>
                  {request.duration ? `${request.duration.value} ${request.duration.type}` : 'Not specified'}
                </Typography>
              </div>
            </div>
          </Card>
        </div>

        {/* Company Information */}
        <Card className="p-6 mt-6">
          <Typography variant="h5" color="blue-gray" className="mb-4 flex items-center">
            <BuildingOfficeIcon className="h-6 w-6 mr-2 text-blue-500" />
            Company Information
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray">
                Company Name
              </Typography>
              <Typography variant="paragraph" color="blue-gray">
                {request.companyDetails.name}
              </Typography>
            </div>
            <div>
              <Typography variant="small" color="blue-gray">
                Company Type
              </Typography>
              <Typography variant="paragraph" color="blue-gray">
                {request.companyDetails.type}
              </Typography>
            </div>
            <div>
              <Typography variant="small" color="blue-gray">
                Email
              </Typography>
              <Typography variant="paragraph" color="blue-gray">
                {request.companyDetails.email}
              </Typography>
            </div>
            <div>
              <Typography variant="small" color="blue-gray">
                Address
              </Typography>
              <Typography variant="paragraph" color="blue-gray">
                {request.companyDetails.address}
              </Typography>
            </div>
          </div>
        </Card>

        {/* Attachments */}
        <Card className="p-6 mt-6">
          <Typography variant="h5" color="blue-gray" className="mb-4 flex items-center">
            <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-500" />
            Request Attachments
          </Typography>
          <div className="space-y-4">
            {request.attachments?.map((attachment) => (
              <div key={attachment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <DocumentTextIcon className="h-6 w-6 text-blue-500" />
                  <div>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {attachment.originalName}
                    </Typography>
                    <Typography variant="small" color="gray">
                      Uploaded on {new Date(attachment.uploadedAt).toLocaleDateString()}
                    </Typography>
                  </div>
                </div>
                <a
                  href={`http://localhost:5000/public/uploads/${attachment.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </Card>

        {/* Admin Feedback */}
        {request.approvals && request.approvals.length > 0 && (
          <Card className="p-6 mt-6">
            <Typography variant="h5" color="blue-gray" className="mb-4 flex items-center">
              <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-500" />
              Admin Feedback
            </Typography>
            <div className="space-y-6">
              {request.approvals
                .filter(approval => approval.feedbackMessage || (approval.feedbackAttachments && approval.feedbackAttachments.length > 0))
                .map((approval, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="mb-4">
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {approval.stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Review
                    </Typography>
                    <Typography variant="small" color="gray">
                      {new Date(approval.date).toLocaleDateString()}
                    </Typography>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        approval.decision === 'approve' 
                          ? 'bg-green-100 text-green-800' 
                          : approval.decision === 'disapprove'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {approval.decision}
                      </span>
                    </div>
                  </div>
                  
                  {/* Feedback Attachments - Only show these to users */}
                  {approval.feedbackAttachments && approval.feedbackAttachments.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Attachments:
                      </Typography>
                      {approval.feedbackAttachments.map((attachment, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                            <Typography variant="small" color="blue-gray">
                              {attachment.split('/').pop()}
                            </Typography>
                          </div>
                          <a
                            href={`http://localhost:5000/public/uploads/${attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            <span>Download</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Feedback Message - Only show this to users */}
                  {approval.feedbackMessage && (
                    <div className="mt-4">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Message for you:
                      </Typography>
                      <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                        <Typography variant="small" color="blue-gray" className="leading-relaxed">
                        {approval.feedbackMessage}
                      </Typography>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {request.approvals.filter(approval => approval.feedbackMessage || (approval.feedbackAttachments && approval.feedbackAttachments.length > 0)).length === 0 && (
              <div className="text-center py-8">
                <Typography variant="small" color="gray">
                  No feedback messages or attachments available yet.
                </Typography>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default RequestDetails; 