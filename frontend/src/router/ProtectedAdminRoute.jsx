import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || !["partnership-division", "general-director", "law-department"].includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
