import { Route, Routes, Navigate } from "react-router-dom";
import AdminRoute from './AdminRoute';
import Login from '../pages/login';

const RouteConfig = () => {
  return (
    <Routes>
      {/* Redirect /login to /admin/login */}
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />
      
      {/* Main login route */}
      <Route path="/admin/login" element={<Login />} />
      
      {/* Admin Routes */}
      {AdminRoute.map((route) => route)}
      
      {/* Redirect from root to login */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default RouteConfig;