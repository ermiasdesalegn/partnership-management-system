import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spinner } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import { 
  DocumentIcon, 
  CalendarIcon, 
  BuildingOfficeIcon, 
  ArrowLeftIcon, 
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view request details');
          navigate('/internal/login');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/v1/internal/requests/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch request details');
        }

        setRequest(data.data.request);
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id, navigate]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <Typography variant="h4" color="red" className="mb-4">
            Error
          </Typography>
          <Typography color="gray" className="mb-4">
            {error}
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
              <div className="flex items-center space-x-4">
                <ClockIcon className="h-6 w-6 text-blue-500" />
                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Current Stage
                  </Typography>
                  <Typography variant="small" color="gray">
                    {request.currentStage}
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
        {request.attachments && request.attachments.length > 0 && (
          <Card className="p-6 mt-6">
            <Typography variant="h5" color="blue-gray" className="mb-4 flex items-center">
              <DocumentIcon className="h-6 w-6 mr-2 text-blue-500" />
              Attached Documents
            </Typography>
            <div className="space-y-4">
              {request.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <DocumentIcon className="h-8 w-8 text-blue-500" />
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {file.originalName}
                      </Typography>
                      <Typography variant="small" color="gray">
                        Uploaded on {new Date(file.uploadedAt).toLocaleDateString()}
                      </Typography>
                    </div>
                  </div>
                  <Button
                    variant="text"
                    className="p-2"
                    onClick={() => {
                      const link = document.createElement('a');
                      const fileName = file.path.split('/').pop();
                      link.href = `http://localhost:5000/public/uploads/${fileName}`;
                      link.download = file.originalName;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RequestDetails; 