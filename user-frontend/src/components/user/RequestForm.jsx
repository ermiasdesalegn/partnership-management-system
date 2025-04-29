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
  userDetails: yup.object().shape({
    name: yup.string().required("Your name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    phone: yup.string()
      .matches(/^9\d{8}$/, "Phone must start with 9 and have 9 digits")
      .required("Phone is required"),
  }),
  companyDetails: yup.object().shape({
    name: yup.string().required("Company Name is required"),
    type: yup.string().required("Company Type is required"),
    address: yup.string().required("Address is required"),
    email: yup.string().email("Invalid company email format").required("Company email is required"),
  }),
  frameworkType: yup.string().required("Framework Type is required"),
  duration: yup.string().required("Duration is required"),
});

export default function RequestForm() {
  const navigate = useNavigate();
  const { control, register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(externalSchema),
    defaultValues: {
      userDetails: { phone: '' },
      companyDetails: { type: 'Private' },
      frameworkType: 'MOU',
    }
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      toast.error('Please login to submit a request', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate('/login');
      return;
    }
    setToken(storedToken);
  }, [navigate]);

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(uploadedFiles);
    toast.success(`${uploadedFiles.length} file(s) uploaded successfully!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Please login to submit a request', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
      formData.append('frameworkType', data.frameworkType);
      formData.append('duration', data.duration);

      const response = await axios.post('http://localhost:5000/api/v1/user/requests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      toast.success('Request submitted successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Reset form
      setFiles([]);
      setValue('userDetails.name', '');
      setValue('userDetails.email', '');
      setValue('userDetails.phone', '9');
      setValue('companyDetails.name', '');
      setValue('companyDetails.address', '');
      setValue('companyDetails.email', '');
      setValue('companyDetails.type', 'Private');
      setValue('frameworkType', 'MOU');
      setValue('duration', '');

    } catch (error) {
      console.error('Error submitting request:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit request', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#3c8dbc]/5 to-white flex flex-col">
      <div className="w-full flex justify-center">
        <h1 className="text-3xl font-extrabold text-[#222] tracking-tight mb-8 mt-10 text-center">
          Partnership Request Portal
        </h1>
      </div>
      <div className="flex justify-center items-center w-full px-4 md:px-12 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-[#3c8dbc]/20"
          style={{ minHeight: '700px', background: 'linear-gradient(135deg, rgba(60,141,188,0.04) 0%, rgba(255,255,255,0.9) 100%)' }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#222] mb-6 font-sans tracking-tight">Your Details</h2>
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#222] mb-2 font-sans">Full Name *</label>
                  <Input
                    {...register("userDetails.name")}
                    error={!!errors.userDetails?.name}
                    className="rounded-xl bg-gray-50 px-4 py-3 shadow-sm !border !border-gray-300 focus:!border-[#3c8dbc] text-black text-base transition-transform duration-200 focus:scale-105 hover:scale-105"
                    containerProps={{ className: "min-w-0" }}
                  />
                  {errors.userDetails?.name && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.userDetails.name.message}</span>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#222] mb-2 font-sans">Email *</label>
                  <Input
                    type="email"
                    {...register("userDetails.email")}
                    error={!!errors.userDetails?.email}
                    className="rounded-xl bg-gray-50 px-4 py-3 shadow-sm !border !border-gray-300 focus:!border-[#3c8dbc] text-black text-base transition-transform duration-200 focus:scale-105 hover:scale-105"
                    containerProps={{ className: "min-w-0" }}
                  />
                  {errors.userDetails?.email && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.userDetails.email.message}</span>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#222] mb-2 font-sans">Phone *</label>
                  <Input
                    {...register("userDetails.phone")}
                    error={!!errors.userDetails?.phone}
                    className="rounded-xl bg-gray-50 px-4 py-3 shadow-sm !border !border-gray-300 focus:!border-[#3c8dbc] text-black text-base transition-transform duration-200 focus:scale-105 hover:scale-105"
                    containerProps={{ className: "min-w-0" }}
                  />
                  {errors.userDetails?.phone && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.userDetails.phone.message}</span>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#222] mb-6 font-sans tracking-tight">Company Details</h2>
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#222] mb-2 font-sans">Company Name *</label>
                  <Input
                    {...register("companyDetails.name")}
                    error={!!errors.companyDetails?.name}
                    className="rounded-xl bg-gray-50 px-4 py-3 shadow-sm !border !border-gray-300 focus:!border-[#3c8dbc] text-black text-base transition-transform duration-200 focus:scale-105 hover:scale-105"
                    containerProps={{ className: "min-w-0" }}
                  />
                  {errors.companyDetails?.name && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.companyDetails.name.message}</span>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#222] mb-2 font-sans">Company Email *</label>
                  <Input
                    type="email"
                    {...register("companyDetails.email")}
                    error={!!errors.companyDetails?.email}
                    className="rounded-xl bg-gray-50 px-4 py-3 shadow-sm !border !border-gray-300 focus:!border-[#3c8dbc] text-black text-base transition-transform duration-200 focus:scale-105 hover:scale-105"
                    containerProps={{ className: "min-w-0" }}
                  />
                  {errors.companyDetails?.email && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.companyDetails.email.message}</span>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#222] mb-2 font-sans">Company Address *</label>
                  <Input
                    {...register("companyDetails.address")}
                    error={!!errors.companyDetails?.address}
                    className="rounded-xl bg-gray-50 px-4 py-3 shadow-sm !border !border-gray-300 focus:!border-[#3c8dbc] text-black text-base transition-transform duration-200 focus:scale-105 hover:scale-105"
                    containerProps={{ className: "min-w-0" }}
                  />
                  {errors.companyDetails?.address && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.companyDetails.address.message}</span>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#222] mb-2 font-sans">Company Type *</label>
                  <Controller
                    name="companyDetails.type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        error={!!errors.companyDetails?.type}
                        className="rounded-xl bg-gray-50 px-4 py-3 shadow-sm !border !border-gray-300 focus:!border-[#3c8dbc] text-black text-base transition-transform duration-200 focus:scale-105 hover:scale-105"
                        containerProps={{ className: "min-w-0" }}
                        menuProps={{ className: "rounded-xl shadow-lg bg-white border border-gray-200" }}
                        iconProps={{ className: "text-[#3c8dbc]" }}
                      >
                        {["Government", "Private", "Non-Government", "Other"].map((type) => (
                          <Option key={type} value={type} className="rounded-lg px-3 py-2 hover:bg-[#3c8dbc] hover:text-white transition-colors">
                            {type}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.companyDetails?.type && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.companyDetails.type.message}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#222] mb-6 font-sans tracking-tight">Partnership Details</h2>
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#222] mb-2 font-sans">Framework Type *</label>
                  <Controller
                    name="frameworkType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        error={!!errors.frameworkType}
                        className="rounded-xl bg-gray-50 px-4 py-3 shadow-sm !border !border-gray-300 focus:!border-[#3c8dbc] text-black text-base transition-transform duration-200 focus:scale-105 hover:scale-105"
                        containerProps={{ className: "min-w-0" }}
                      >
                        {["MOU", "NDA", "MOA", "Contract", "Other"].map((type) => (
                          <Option key={type} value={type} className="rounded-lg px-3 py-2 hover:bg-[#3c8dbc] hover:text-white transition-colors">
                            {type}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.frameworkType && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.frameworkType.message}</span>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#222] mb-2 font-sans">Duration *</label>
                  <Input
                    {...register("duration")}
                    error={!!errors.duration}
                    className="rounded-xl bg-gray-50 px-4 py-3 shadow-sm !border !border-gray-300 focus:!border-[#3c8dbc] text-black text-base transition-transform duration-200 focus:scale-105 hover:scale-105"
                    containerProps={{ className: "min-w-0" }}
                  />
                  {errors.duration && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.duration.message}</span>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#222] mb-6 font-sans tracking-tight">Attachments</h2>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#3c8dbc]/40 bg-[#f4faff] rounded-xl p-8 cursor-pointer hover:border-[#3c8dbc] hover:bg-[#3c8dbc]/10 transition-colors shadow-inner">
                  <CloudArrowUpIcon className="w-8 h-8 text-[#3c8dbc] mb-2 animate-pulse" />
                  <span className="text-[#3c8dbc] text-base mb-1 font-semibold font-sans">
                    Click or drag files to upload
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {files.length > 0 && (
                    <div className="mt-2 space-y-1 w-full">
                      {files.map((file, i) => (
                        <div key={i} className="text-xs text-[#3c8dbc] bg-white/90 rounded px-2 py-1 shadow-sm mb-1 flex items-center gap-2">
                          <CloudArrowUpIcon className="w-4 h-4 text-[#3c8dbc]" />
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </label>
              </div>
            </div>
            <Button
              type="submit"
              fullWidth
              className="bg-[#3c8dbc] hover:bg-[#2c6a8f] text-white py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 mt-8 text-lg font-bold tracking-wide font-sans"
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