import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Input, Button, Typography } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminSetupPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const token = searchParams.get('token');
      if (!token) {
        toast.error('Invalid setup link');
        return;
      }

      await axios.post('http://localhost:5000/api/v1/super-admin/admins/setup-password', {
        token,
        password: formData.password
      });

      toast.success('Password set successfully! Redirecting to login...');
      setTimeout(() => navigate('/admin/login'), 1500);
    } catch (error) {
      console.error('Error setting up password:', error);
      toast.error(error.response?.data?.message || 'Failed to set password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!searchParams.get('token')) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card color="transparent" shadow={true} className="p-8 border border-red-500/20 rounded-3xl">
          <Typography variant="h4" color="red" className="mb-2 text-center">
            Invalid Setup Link
          </Typography>
          <Typography color="gray" className="mb-8 text-center">
            This password setup link is invalid or has expired.
          </Typography>
          <Button 
            onClick={() => navigate('/admin/login')}
            className="mt-2 bg-[#3c8dbc] hover:bg-[#2c6a8f] text-white" 
            fullWidth
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-white via-[#3c8dbc]/5 to-white">
      <Card color="transparent" shadow={true} className="p-8 border border-[#3c8dbc]/20 rounded-3xl">
        <Typography variant="h4" color="blue-gray" className="mb-2 text-center text-[#3c8dbc]">
          Set Your Password
        </Typography>
        <Typography color="gray" className="mb-8 text-center">
          Please create a new password for your account
        </Typography>

        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              type="password"
              size="lg"
              label="New Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              className="!border-gray-300 focus:!border-[#3c8dbc]"
              labelProps={{ className: "peer-focus:!text-[#3c8dbc]" }}
            />
            {errors.password && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.password}
              </Typography>
            )}
          </div>
          
          <div className="mb-6">
            <Input
              type="password"
              size="lg"
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              className="!border-gray-300 focus:!border-[#3c8dbc]"
              labelProps={{ className: "peer-focus:!text-[#3c8dbc]" }}
            />
            {errors.confirmPassword && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.confirmPassword}
              </Typography>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="mt-2 bg-[#3c8dbc] hover:bg-[#2c6a8f] text-white" 
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Setting Password...' : 'Set Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminSetupPassword; 