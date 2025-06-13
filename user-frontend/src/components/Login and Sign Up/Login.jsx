import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography, Checkbox } from '@material-tailwind/react';
import toast, { Toaster } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Check if the user is internal
      if (data.data.role === 'internal') {
        throw new Error('This login page is only for external users. Please use the internal login page.');
      }

      // Only proceed if user is external
      localStorage.setItem('token', data.token);
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      toast.success('Login successful! Redirecting...');
      setTimeout(() => navigate('/user'), 1500);

    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsSubmitting(true);
      
      // Decode the Google JWT token to get user info
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Try to login with Google data (will create account if doesn't exist)
      const response = await fetch('http://localhost:5000/api/v1/user/google-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: decoded.name,
          email: decoded.email,
          googleId: decoded.sub,
          picture: decoded.picture
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      localStorage.setItem('token', data.token);
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      toast.success('Google login successful! Redirecting...');
      setTimeout(() => navigate('/user'), 1500);

    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Google login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-white via-[#3c8dbc]/5 to-white">
      <Toaster position="top-center" reverseOrder={false} />
      
      <Card color="transparent" shadow={true} className="p-8 border border-[#3c8dbc]/20 rounded-3xl">
        <Typography variant="h4" color="blue-gray" className="mb-2 text-center text-[#3c8dbc]">
          Welcome Back
        </Typography>
        <Typography color="gray" className="mb-8 text-center">
          Sign in to continue to your account
        </Typography>

        {/* Google OAuth Button */}
        <div className="mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            logo_alignment="left"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-4 text-gray-500 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <form className="mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
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
          
          <div className="mb-4">
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
          
          <div className="flex items-center justify-between mb-6">
            <Checkbox
              label="Remember me"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              color="blue"
              className="checked:bg-[#3c8dbc]"
            />
            <Link 
              to="/forgot-password" 
              className="text-sm text-[#3c8dbc] hover:text-[#2c6a8f] transition-colors"
            >
              Forgot password?
            </Link>
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
                Logging In...
              </div>
            ) : 'Log In'}
          </Button>
          
          <Typography color="gray" className="mt-4 text-center">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-[#3c8dbc] hover:text-[#2c6a8f] font-medium transition-colors"
            >
              Create Account
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}