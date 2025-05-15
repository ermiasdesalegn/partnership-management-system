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
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
      .matches(/^9\d{8}$/, "Phone must start with 9 and have 9 digits")
      .required("Phone is required"),
  }),
});

export default function RequestForm() {
  const navigate = useNavigate();
  const { control, register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(externalSchema),
    defaultValues: {
      companyDetails: { 
        type: 'Private',
        phone: '9'
      },
    }
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      toast.error('Please login to submit a request');
      navigate('/login');
      return;
    }
    setToken(storedToken);

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/user/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });
        setUserData(response.data.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(uploadedFiles);
    toast.success(`${uploadedFiles.length} file(s) uploaded successfully!`);
  };

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Please login to submit a request');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append files
      files.forEach(file => {
        formData.append('files', file);
      });

      // Append other form data
      formData.append('companyDetails', JSON.stringify(data.companyDetails));

      const response = await axios.post('http://localhost:5000/api/v1/user/requests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      toast.success('Request submitted successfully!');

      // Reset form
      setFiles([]);
      setValue('companyDetails.name', '');
      setValue('companyDetails.address', '');
      setValue('companyDetails.email', '');
      setValue('companyDetails.phone', '9');
      setValue('companyDetails.type', 'Private');

      // Navigate to request status page
      navigate('/user/request-status');

    } catch (error) {
      console.error('Error submitting request:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit request');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Partnership Request Portal
          </h1>

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

            {/* File Upload */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Attach Documents
              </h2>
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

            <Button
              type="submit"
              fullWidth
              className="bg-[#3c8dbc] hover:bg-[#2c6a8f] text-white py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 mt-8 text-lg font-bold tracking-wide"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-spin">↻</span>
                  Submitting...
                </div>
              ) : 'Submit Request'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}