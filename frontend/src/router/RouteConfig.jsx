import { Route, Routes } from "react-router";
// import MainLayout from "../../layouts/MainLayout";
import AdminRoute from './AdminRoute'
import Login from '../pages/login'
import AdminDashboard from "../components/dashboard/Index";
const RouteConfig = () => {
  return (
    <Routes>
      {/* Public Routes (Visible to Everyone) */}
      <Route path="/" element={<Login />}>
      <Route path="/admin" element={<AdminDashboard/>}/>

      </Route>
     {AdminRoute.map((route) => route)}

    </Routes>
  );
};

export default RouteConfig;
