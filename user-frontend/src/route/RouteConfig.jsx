import { Route, Routes } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/landing-page/Home";
import SignUp from "../components/Login and Sign Up/Signup";
import Login from "../components/Login and Sign Up/Login";
import About from "../pages/landing-page/About";
import Partnership from "../pages/landing-page/Partnership";
import Feedback from "../components/feedback/Feedback";
import UserRoute from "../components/user/router/UserRoute"; // Import User Routes
import { useAuth } from "../context/AuthContext";
import RequestDetails from "../components/user/RequestDetails";
// import AdminRoute from '../Admin/router/AdminRoute'
const RouteConfig = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes (Visible to Everyone) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="about" element={<About />} />
        <Route path="partnership" element={<Partnership />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>
      
      {UserRoute.map((route) => route)}

      {isAuthenticated && (
        <>
          <Route path="/user/requests/:id" element={<RequestDetails />} />
        </>
      )}

    </Routes>
  );
};

export default RouteConfig;
