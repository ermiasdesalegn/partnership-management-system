import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const externalSchema = yup.object().shape({
  companyDetails: yup.object().shape({
    name: yup.string().required("Company Name is required"),
    type: yup.string().required("Company Type is required"),
    address: yup.string().required("Address is required"),
    email: yup.string().email("Invalid company email format").required("Company email is required"),
    phone: yup.string()
      .matches(/^\d{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),
  }),
});

export default function EditRequestForm() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const { control, register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(externalSchema),
    defaultValues: {
      companyDetails: { 
        type: 'Private',
        phone: ''
      }
    }
  });

  const [files, setFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [removedAttachments, setRemovedAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [requestData, setRequestData] = useState(null);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      toast.error('Please login to edit request');
      navigate('/login');
      return;
    }
    setToken(storedToken);

    // Main function to fetch and populate form data
    const fetchRequestData = async () => {
      if (!requestId) {
        toast.error('Invalid request ID');
        navigate('/user/requests');
        return;
      }

      try {
        setIsLoading(true);
        console.log('Fetching request data for ID:', requestId);

        // Fetch user data and request data in parallel
        const [userResponse, requestResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/v1/user/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          }),
          axios.get(`http://localhost:5000/api/v1/user/requests/${requestId}`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          })
        ]);

        // Set user data
        if (userResponse.data.status === 'success') {
          setUserData(userResponse.data.data.user);
          console.log('User data loaded successfully');
        }

        // Set and validate request data
        if (requestResponse.data.status === 'success') {
          const request = requestResponse.data.data.request;
          setRequestData(request);
          console.log('Request data loaded:', request);

          // Validate request can be edited (only pending requests)
          if (request.status?.toLowerCase().trim() !== 'pending') {
            toast.error('Only pending requests can be edited');
            navigate(`/user/requests/${requestId}`);
            return;
          }

          // Populate form fields using setValue() from react-hook-form
          populateFormFields(request);

          // Set existing attachments in state
          setExistingAttachments(request.attachments || []);
          console.log('Existing attachments:', request.attachments?.length || 0);

        } else {
          throw new Error('Failed to fetch request data');
        }

      } catch (error) {
        console.error('Error fetching request data:', error);
        handleFetchError(error);
      } finally {
        setIsLoading(false);
      }
    };

    // Function to populate form fields
    const populateFormFields = (request) => {
      try {
        // Populate company details with fallback values
        setValue('companyDetails.name', request.companyDetails?.name || '');
        setValue('companyDetails.type', request.companyDetails?.type || 'Private');
        setValue('companyDetails.address', request.companyDetails?.address || '');
        setValue('companyDetails.email', request.companyDetails?.email || '');
        setValue('companyDetails.phone', request.companyDetails?.phone || '');

        console.log('Form fields populated successfully');
        
        // Validate populated data
        if (!request.companyDetails?.name) {
          console.warn('Missing company name in request data');
        }
        if (!request.companyDetails?.email) {
          console.warn('Missing company email in request data');
        }

      } catch (error) {
        console.error('Error populating form fields:', error);
        toast.error('Error loading form data');
      }
    };

    // Function to handle fetch errors
    const handleFetchError = (error) => {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.status === 404) {
        toast.error('Request not found');
        navigate('/user/requests');
      } else if (error.response?.status === 403) {
        toast.error('You are not authorized to edit this request');
        navigate('/user/requests');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load request data');
        navigate('/user/requests');
      }
    };

    // Execute the fetch function
    fetchRequestData();

  }, [navigate, requestId, setValue]);

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...uploadedFiles]);
    toast.success(`${uploadedFiles.length} file(s) added successfully!`);
  };

  const removeNewFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  const removeExistingAttachment = (attachmentId) => {
    setExistingAttachments(prev => prev.filter(att => att._id !== attachmentId));
    setRemovedAttachments(prev => [...prev, attachmentId]);
    toast.success('Attachment will be removed when you save');
  };

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Please login to update request');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append new files
      files.forEach(file => {
        formData.append('files', file);
      });

      // Append other form data
      formData.append('companyDetails', JSON.stringify(data.companyDetails));
      
      // Append removed attachments list
      if (removedAttachments.length > 0) {
        formData.append('removedAttachments', JSON.stringify(removedAttachments));
      }

      const response = await axios.patch(`http://localhost:5000/api/v1/user/requests/${requestId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      toast.success('Request updated successfully!');

      // Navigate back to request details
      navigate(`/user/requests/${requestId}`);

    } catch (error) {
      console.error('Error updating request:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        navigate('/login');
      } else if (error.response?.status === 400 && error.response?.data?.message?.includes('pending')) {
        toast.error('Only pending requests can be edited');
        navigate(`/user/requests/${requestId}`);
      } else {
        toast.error(error.response?.data?.message || 'Failed to update request');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3c8dbc]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(`/user/requests/${requestId}`)}
              className="flex items-center text-[#3c8dbc] hover:text-[#2c6a8f] transition-colors duration-300 group"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Request
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Partnership Request
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* User Information Display */}
            {userData && (
              <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-gray-600">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-600">{userData.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Company Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Company Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    size="lg"
                    label="Company Name"
                    {...register("companyDetails.name")}
                    error={!!errors.companyDetails?.name}
                    className="!border-gray-300 focus:!border-[#3c8dbc]"
                    labelProps={{ className: "peer-focus:!text-[#3c8dbc]" }}
                  />
                  {errors.companyDetails?.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.companyDetails.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    name="companyDetails.type"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent"
                        error={!!errors.companyDetails?.type}
                      >
                        <option value="Government">Government</option>
                        <option value="Private">Private</option>
                        <option value="Non-Government">Non-Government</option>
                        <option value="Other">Other</option>
                      </select>
                    )}
                  />
                  {errors.companyDetails?.type && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.companyDetails.type.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    size="lg"
                    label="Company Address"
                    {...register("companyDetails.address")}
                    error={!!errors.companyDetails?.address}
                    className="!border-gray-300 focus:!border-[#3c8dbc]"
                    labelProps={{ className: "peer-focus:!text-[#3c8dbc]" }}
                  />
                  {errors.companyDetails?.address && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.companyDetails.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    size="lg"
                    label="Company Email"
                    {...register("companyDetails.email")}
                    error={!!errors.companyDetails?.email}
                    className="!border-gray-300 focus:!border-[#3c8dbc]"
                    labelProps={{ className: "peer-focus:!text-[#3c8dbc]" }}
                  />
                  {errors.companyDetails?.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.companyDetails.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    size="lg"
                    label="Phone Number"
                    {...register("companyDetails.phone")}
                    error={!!errors.companyDetails?.phone}
                    className="!border-gray-300 focus:!border-[#3c8dbc]"
                    labelProps={{ className: "peer-focus:!text-[#3c8dbc]" }}
                  />
                  {errors.companyDetails?.phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.companyDetails.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Existing Attachments */}
            {existingAttachments.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Current Attachments
                </h2>
                <div className="space-y-2">
                  {existingAttachments.map((attachment, index) => (
                    <div key={attachment._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentIcon className="h-5 w-5 text-[#3c8dbc]" />
                        <span className="text-sm text-gray-700">{attachment.originalName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingAttachment(attachment._id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                        title="Remove attachment"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New File Upload */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {existingAttachments.length > 0 ? 'Add New Documents' : 'Attach Documents'}
              </h2>
              
              {/* Show newly added files */}
              {files.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">New Files Added:</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DocumentIcon className="h-5 w-5 text-blue-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewFile(index)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                          title="Remove file"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <CloudArrowUpIcon className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPEG, or PNG (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate(`/user/requests/${requestId}`)}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#3c8dbc] hover:bg-[#2c6a8f] text-white py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 text-lg font-bold tracking-wide"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin">↻</span>
                    Updating...
                  </div>
                ) : 'Update Request'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 