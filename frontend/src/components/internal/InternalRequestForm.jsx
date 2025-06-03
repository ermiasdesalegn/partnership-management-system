import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUserProfile, submitRequest } from "../../api/userApi";
import { FaBuilding, FaEnvelope, FaMapMarkerAlt, FaPhone, FaFileAlt, FaClock, FaSpinner, FaUpload, FaFileUpload, FaTimes, FaGavel, FaSearch, FaUserTie } from "react-icons/fa";
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
    duration: {
      value: 1,
      type: "years"
    },
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
    } else if (name === 'durationValue') {
      setFormData(prev => ({
        ...prev,
        duration: {
          ...prev.duration,
          value: parseInt(value) || 1
        }
      }));
    } else if (name === 'durationType') {
      setFormData(prev => ({
        ...prev,
        duration: {
          ...prev.duration,
          type: value
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
    if (!formData.duration.value || formData.duration.value < 1) newErrors.duration = "Duration must be at least 1";
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
        duration: JSON.stringify(formData.duration),
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">New Partnership Request</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Company Details Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <FaBuilding className="text-[#3c8dbc]" />
                  Company Details
              </h3>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    name="companyDetails.name"
                    value={formData.companyDetails.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors['companyDetails.name'] ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent`}
                    placeholder="Enter company name"
                  />
                  {errors['companyDetails.name'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['companyDetails.name']}</p>
                  )}
                </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Company Type</label>
                  <select
                    name="companyDetails.type"
                    value={formData.companyDetails.type}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors['companyDetails.type'] ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent`}
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

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Company Email</label>
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
                        } focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent`}
                        placeholder="Enter company email"
                    />
                  </div>
                  {errors['companyDetails.email'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['companyDetails.email']}</p>
                  )}
                </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Company Address</label>
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
                        } focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent`}
                      placeholder="Enter company address"
                    />
                  </div>
                  {errors['companyDetails.address'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['companyDetails.address']}</p>
                  )}
                </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Company Phone</label>
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
                        } focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent`}
                        placeholder="Enter company phone"
                    />
                  </div>
                  {errors['companyDetails.phone'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['companyDetails.phone']}</p>
                  )}
                </div>
              </div>
            </div>

              {/* Partnership Details Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <FaFileAlt className="text-[#3c8dbc]" />
                Partnership Details
              </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Framework Type</label>
                  <select
                    name="frameworkType"
                    value={formData.frameworkType}
                    onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.frameworkType ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent`}
                  >
                      <option value="MOU">MOU</option>
                      <option value="MOA">MOA</option>
                    <option value="Contract">Contract</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <div className="flex gap-4">
                      <input
                        type="number"
                        name="durationValue"
                        value={formData.duration.value}
                        onChange={handleChange}
                        min="1"
                        className={`w-24 px-4 py-2 rounded-lg border ${
                          errors.duration ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent`}
                      />
                      <select
                        name="durationType"
                        value={formData.duration.type}
                      onChange={handleChange}
                        className={`w-32 px-4 py-2 rounded-lg border ${
                        errors.duration ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent`}
                      >
                        <option value="years">Years</option>
                        <option value="months">Months</option>
                      </select>
                  </div>
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                  )}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <FaFileAlt className="text-[#3c8dbc]" />
                  Description
                </h3>
                <div className="space-y-2">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent`}
                  placeholder="Describe the purpose and details of the partnership..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>

              {/* File Upload Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <FaUpload className="text-[#3c8dbc]" />
                Attachments
              </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaFileUpload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, or images (MAX. 5MB)</p>
                      </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                        accept=".pdf,.doc,.docx,image/*"
                  />
                  </label>
                </div>

                {files.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                      <div className="space-y-2">
                      {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setFiles(files.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700"
                          >
                              <FaTimes />
                          </button>
                          </div>
                      ))}
                      </div>
                  </div>
                )}
                {errors.files && (
                    <p className="mt-1 text-sm text-red-600">{errors.files}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                  className="px-6 py-3 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#2c6a8f] focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                      <FaSpinner className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                    'Submit Request'
                )}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalRequestForm; 