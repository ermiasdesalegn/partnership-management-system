import { Route, Routes, Navigate } from "react-router-dom";
import AdminRoute from './AdminRoute';
import Login from '../pages/login';
import SetupPassword from '../pages/SetupPassword';
import InternalLayout from '../layout/InternalLayout';
import InternalDashboard from '../components/internal/InternalDashboard';
import InternalRequestForm from '../components/internal/InternalRequestForm';
import RequestDetails from '../components/internal/RequestDetails';
import Profile from '../components/internal/Profile';
import SuperAdminDashboard from '../pages/SuperAdminDashboard';
import AdminSetupPassword from '../pages/AdminSetupPassword';
import Requests from '../components/internal/Requests';

const RouteConfig = () => {
  return (
    <Routes>
      {/* Redirect old login routes to the new unified login */}
      <Route path="/admin/login" element={<Navigate to="/" replace />} />
      <Route path="/internal/login" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      
      {/* Main login route */}
      <Route path="/" element={<Login />} />
      
      {/* Internal User Routes */}
      <Route path="/internal" element={<InternalLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<InternalDashboard />} />
        <Route path="requests" element={<Requests />} />
        <Route path="request" element={<InternalRequestForm />} />
        <Route path="request/:id" element={<RequestDetails />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Password setup routes */}
      <Route path="/setup-password" element={<SetupPassword />} />
      <Route path="/admin/setup-password" element={<AdminSetupPassword />} />
      
      {/* Super Admin Route */}
      <Route path="/super-admin" element={<SuperAdminDashboard />} />
      
      {/* Admin Routes */}
      {AdminRoute.map((route) => route)}
    </Routes>
  );
};

export default RouteConfig;