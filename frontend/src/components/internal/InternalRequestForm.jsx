import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, Input, Button, Typography, Select, Option } from '@material-tailwind/react';

const InternalRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    frameworkType: '',
    companyDetails: {
      name: '',
      type: '',
      address: '',
      email: ''
    }
  });
  const [userData, setUserData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/v1/internal/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      }
    };

    fetchUserData();
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
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.frameworkType) {
      newErrors.frameworkType = 'Framework type is required';
    }
    
    if (!formData.companyDetails.name.trim()) {
      newErrors['companyDetails.name'] = 'Company name is required';
    }
    
    if (!formData.companyDetails.type) {
      newErrors['companyDetails.type'] = 'Company type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to submit a request');
        navigate('/internal/login');
        return;
      }

      // Create FormData to handle file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('frameworkType', formData.frameworkType);
      formDataToSend.append('companyDetails', JSON.stringify(formData.companyDetails));
      formDataToSend.append('department', userData.department);

      const response = await axios.post('http://localhost:5000/api/v1/internal/requests', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Request submitted successfully!');
      navigate('/internal/dashboard');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-white via-[#3c8dbc]/5 to-white">
      <Card color="transparent" shadow={true} className="p-8 border border-[#3c8dbc]/20 rounded-3xl">
        <Typography variant="h4" color="blue-gray" className="mb-2 text-center text-[#3c8dbc]">
          Create New Request
        </Typography>
        <Typography color="gray" className="mb-8 text-center">
          Fill in the details to submit a new request
        </Typography>

        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              size="lg"
              label="Company Name"
              name="companyDetails.name"
              value={formData.companyDetails.name}
              onChange={handleChange}
              error={!!errors['companyDetails.name']}
              className="!border-gray-300 focus:!border-[#3c8dbc]"
              labelProps={{ className: "peer-focus:!text-[#3c8dbc]" }}
            />
            {errors['companyDetails.name'] && (
              <Typography variant="small" color="red" className="mt-1">
                {errors['companyDetails.name']}
              </Typography>
            )}
          </div>

          <div className="mb-6">
            <Select
              label="Company Type"
              name="companyDetails.type"
              value={formData.companyDetails.type}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                companyDetails: { ...prev.companyDetails, type: value }
              }))}
              error={!!errors['companyDetails.type']}
            >
              <Option value="Government">Government</Option>
              <Option value="Private">Private</Option>
              <Option value="Non-Government">Non-Government</Option>
              <Option value="Other">Other</Option>
            </Select>
            {errors['companyDetails.type'] && (
              <Typography variant="small" color="red" className="mt-1">
                {errors['companyDetails.type']}
              </Typography>
            )}
          </div>

          <div className="mb-6">
            <Input
              size="lg"
              label="Company Address"
              name="companyDetails.address"
              value={formData.companyDetails.address}
              onChange={handleChange}
              className="!border-gray-300 focus:!border-[#3c8dbc]"
              labelProps={{ className: "peer-focus:!text-[#3c8dbc]" }}
            />
          </div>

          <div className="mb-6">
            <Input
              size="lg"
              label="Company Email"
              name="companyDetails.email"
              value={formData.companyDetails.email}
              onChange={handleChange}
              className="!border-gray-300 focus:!border-[#3c8dbc]"
              labelProps={{ className: "peer-focus:!text-[#3c8dbc]" }}
            />
          </div>

          <div className="mb-6">
            <Select
              label="Framework Type"
              name="frameworkType"
              value={formData.frameworkType}
              onChange={(value) => setFormData(prev => ({ ...prev, frameworkType: value }))}
              error={!!errors.frameworkType}
            >
              <Option value="MOU">MOU</Option>
              <Option value="MOA">MOA</Option>
              <Option value="Contract">Contract</Option>
              <Option value="Other">Other</Option>
            </Select>
            {errors.frameworkType && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.frameworkType}
              </Typography>
            )}
          </div>

          {userData && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Department
              </Typography>
              <Typography variant="paragraph" color="gray">
                {userData.department}
              </Typography>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => navigate('/internal/dashboard')}
              className="bg-gray-500 hover:bg-gray-600 text-white"
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#3c8dbc] hover:bg-[#2c6a8f] text-white"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default InternalRequestForm; 