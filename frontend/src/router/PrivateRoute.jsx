import { Navigate, useLocation } from "react-router-dom";

// Private route component to protect admin routes
const PrivateRoute = ({ children, role, requiredRole }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("adminToken");
  const userRole = localStorage.getItem("role"); // Assume you're storing the role in localStorage

  if (!isLoggedIn || (requiredRole && userRole !== requiredRole)) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
