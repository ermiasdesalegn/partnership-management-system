import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography, Checkbox } from '@material-tailwind/react';
import toast, { Toaster } from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/v1/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);

    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-white via-[#3c8dbc]/5 to-white mt-12">
      <Toaster position="top-center" reverseOrder={false} />
      
      <Card color="transparent" shadow={true} className="p-8 border border-[#3c8dbc]/20 rounded-3xl">
        <Typography variant="h4" color="blue-gray" className="mb-2 text-center text-[#3c8dbc]">
          Create Account
        </Typography>
        <Typography color="gray" className="mb-8 text-center">
          Sign up to get started with your account
        </Typography>

        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              size="lg"
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              className="!border-gray-300 focus:!border-[#3c8dbc]"
              labelProps={{ className: "peer-focus:!text-[#3c8dbc]" }}
            />
            {errors.name && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.name}
              </Typography>
            )}
          </div>
          
          <div className="mb-6">
            <Input
              size="lg"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              className="!border-gray-300 focus:!border-[#3c8dbc]"
              labelProps={{ className: "peer-focus:!text-[#3c8dbc]" }}
            />
            {errors.email && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.email}
              </Typography>
            )}
          </div>
          
          <div className="mb-6">
            <Input
              type="password"
              size="lg"
              label="Password"
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
          
          <div className="mb-6">
            <Checkbox
              label={
                <Typography variant="small" color="gray" className="flex items-center">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#3c8dbc] hover:text-[#2c6a8f] font-medium transition-colors">
                    Terms and Conditions
                  </Link>
                </Typography>
              }
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              color="blue"
              className="checked:bg-[#3c8dbc]"
            />
            {errors.agreeToTerms && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.agreeToTerms}
              </Typography>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="mt-2 bg-[#3c8dbc] hover:bg-[#2c6a8f] text-white" 
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin">↻</span>
                Creating Account...
              </div>
            ) : 'Create Account'}
          </Button>
          
          <Typography color="gray" className="mt-4 text-center">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-[#3c8dbc] hover:text-[#2c6a8f] font-medium transition-colors"
            >
              Log In
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}