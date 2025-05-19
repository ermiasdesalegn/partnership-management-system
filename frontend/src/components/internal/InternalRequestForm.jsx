import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUserProfile, submitRequest } from "../../api/userApi";
import { FaBuilding, FaEnvelope, FaMapMarkerAlt, FaPhone, FaFileAlt, FaClock, FaSpinner } from "react-icons/fa";
import axios from "axios";

const InternalRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyDetails: {
      name: "",
      email: "",
      address: "",
      phone: "",
      type: "Private"
    },
    frameworkType: "MOU",
    duration: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await fetchUserProfile();
        setUserProfile(response.data);
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          companyDetails: {
            ...prev.companyDetails,
            name: response.data.companyName || "",
            email: response.data.email || "",
            address: response.data.address || "",
            phone: response.data.phone || "",
          }
        }));
      } catch (error) {
        toast.error("Failed to load user profile");
      }
    };
    loadUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('companyDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        companyDetails: {
          ...prev.companyDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(uploadedFiles);
    toast.success(`${uploadedFiles.length} file(s) uploaded successfully!`);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyDetails.name.trim()) newErrors['companyDetails.name'] = "Company name is required";
    if (!formData.companyDetails.email.trim()) newErrors['companyDetails.email'] = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.companyDetails.email)) newErrors['companyDetails.email'] = "Invalid email format";
    if (!formData.companyDetails.address.trim()) newErrors['companyDetails.address'] = "Address is required";
    if (!formData.companyDetails.phone.trim()) newErrors['companyDetails.phone'] = "Phone number is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (files.length === 0) newErrors.files = "At least one attachment is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the request data object
      const requestData = {
        companyDetails: JSON.stringify(formData.companyDetails),
        frameworkType: formData.frameworkType,
        duration: formData.duration,
        description: formData.description,
        files: files
      };

      // Log the request data for debugging
      console.log('Request Data:', requestData);

      const response = await submitRequest(requestData);
      console.log('Response:', response);
      
      toast.success("Request submitted successfully!");
      navigate("/internal/requests");
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">New Partnership Request</h2>
            <p className="mt-1 text-blue-100">Fill in the details below to submit your partnership request</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaBuilding className="mr-2 text-blue-500" />
                Company Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyDetails.name"
                    value={formData.companyDetails.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors['companyDetails.name'] ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter company name"
                  />
                  {errors['companyDetails.name'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['companyDetails.name']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Type *
                  </label>
                  <select
                    name="companyDetails.type"
                    value={formData.companyDetails.type}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors['companyDetails.type'] ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Non-Government">Non-Government</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors['companyDetails.type'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['companyDetails.type']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="companyDetails.email"
                      value={formData.companyDetails.email}
                      onChange={handleChange}
                      className={`w-full pl-10 px-4 py-2 rounded-lg border ${
                        errors['companyDetails.email'] ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors['companyDetails.email'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['companyDetails.email']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="companyDetails.address"
                      value={formData.companyDetails.address}
                      onChange={handleChange}
                      className={`w-full pl-10 px-4 py-2 rounded-lg border ${
                        errors['companyDetails.address'] ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter company address"
                    />
                  </div>
                  {errors['companyDetails.address'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['companyDetails.address']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="companyDetails.phone"
                      value={formData.companyDetails.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 px-4 py-2 rounded-lg border ${
                        errors['companyDetails.phone'] ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors['companyDetails.phone'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['companyDetails.phone']}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Partnership Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaFileAlt className="mr-2 text-blue-500" />
                Partnership Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Framework Type *
                  </label>
                  <select
                    name="frameworkType"
                    value={formData.frameworkType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MOU">Memorandum of Understanding (MOU)</option>
                    <option value="Contract">Contract</option>
                    <option value="NDA">Non-Disclosure Agreement (NDA)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaClock className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className={`w-full pl-10 px-4 py-2 rounded-lg border ${
                        errors.duration ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="e.g., 1 year, 6 months"
                    />
                  </div>
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Describe the purpose and details of the partnership..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaFileAlt className="mr-2 text-blue-500" />
                Attachments
              </h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaFileAlt className="mr-2" />
                    Choose Files
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    Upload relevant documents (PDF, DOC, DOCX, JPG, PNG)
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                          <span className="text-sm text-gray-600 truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setFiles(files.filter((_, i) => i !== index))}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {errors.files && (
                  <p className="mt-2 text-sm text-red-600">{errors.files}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InternalRequestForm; 