import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api";
import SigninImage from '../../assets/form-images/sign in.svg';

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        toast.success("Login successful!");
        navigate("/user"); // Changed to navigate to /user
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
      toast.error(
        err.response?.data?.message || "Login failed. Please check your credentials"
      );
    }
  };

  return (
    <div className="bg-gradient-to-r rounded-4xl shadow-lg from-blue-50 to-purple-50 min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center w-full max-w-6xl bg-white shadow-lg rounded-xl p-8 space-x-6">
        {/* Form Section */}
        <div className="w-96 space-y-6">
          <h1 className="text-3xl font-semibold text-center text-gray-800">
            Welcome Back
          </h1>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                {...register("password")}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Login
            </button>
          </form>

          <div className="flex justify-between items-center">
            <Link to="/forgot-password" className="text-blue-500 text-sm hover:underline">
              Forgot password?
            </Link>
            <Link to="/signup" className="text-blue-500 text-sm hover:underline">
              Create account
            </Link>
          </div>
        </div>

        {/* Illustration Section */}
        <div className="hidden md:block w-1/2 p-10">
          <img
            src={SigninImage}
            alt="Login Illustration"
            className="w-full h-auto"
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;