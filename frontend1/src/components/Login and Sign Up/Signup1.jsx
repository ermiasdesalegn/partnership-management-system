import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api";
import SignupImage from '../../assets/form-images/sign up.png'

// Enhanced Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  role: yup.string().oneOf(['external', 'internal'], "Invalid role").required("Role is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
    company: yup.object().when('role', (role, schema) => {  // Fixed syntax
      return role === 'external' ? 
        yup.object().shape({
          name: yup.string().required("Company name is required"),
          type: yup.string()
            .oneOf(["Government", "Private", "Non-Government", "Other"])
            .required("Company type is required"),
          address: yup.string().required("Company address is required"),
          phone: yup.string()
            .matches(/^9\d{8}$/, "Phone number must be 9 digits and start with 9")
            .required("Company phone is required")
        }) 
        : schema.notRequired();
    }),
  department: yup.string().when('role', {
    is: 'internal',
    then: yup.string().required("Department is required")
  })
});

const SignUp = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'external' }
  });

  const watchRole = watch("role");

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role,
        ...(data.role === 'external' ? { company: data.company } : { department: data.department })
      };

      const response = await api.post("/auth/register", payload);
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        toast.success("Account created successfully!");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="bg-white h-[1500px] self-center text-sm mt-12  pr-40 max-w-[1240px] pb-18 rounded-xl mx-auto flex justify-center items-center p-6 shadow-xl">
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mx-auto rounded-lg p-8 h-full">
        {/* Illustration Section */}
        <div className="w-full md:w-1/2 flex justify-end items-center bg-white h-full">
          <div className="w-[70%] h-full">
            <img src={SignupImage} alt="Signup" className="w-full max-w-[400px] h-auto rounded-lg shadow-none" />
            <p className="text-blue-900">Register to work and grow with us!!</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white max-h-[500px] rounded-lg w-full md:w-1/2 max-w-md flex flex-col justify-between">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Create an Account
          </h1>
          <form className="space-y-5 flex-grow" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">User Type</label>
              <select
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                {...register("role")}
              >
                <option value="external">External Partner</option>
                <option value="internal">INSA Employee</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                {...register("name")}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {watchRole === 'external' && (
              <>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    placeholder="Company name"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    {...register("company.name")}
                  />
                  {errors.company?.name && <p className="text-red-500 text-xs mt-1">{errors.company.name.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Company Type</label>
                  <select
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    {...register("company.type")}
                  >
                    <option value="">Select company type</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Non-Government">Non-Government</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.company?.type && <p className="text-red-500 text-xs mt-1">{errors.company.type.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Company Address</label>
                  <input
                    type="text"
                    placeholder="Company address"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    {...register("company.address")}
                  />
                  {errors.company?.address && <p className="text-red-500 text-xs mt-1">{errors.company.address.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Company Phone</label>
                  <div className="relative flex items-center">
                    <span className="bg-gray-300 text-gray-700 px-3 py-3 rounded-l-lg border border-r-0">
                      +251
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter company phone"
                      className="w-full px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      {...register("company.phone")}
                    />
                  </div>
                  {errors.company?.phone && <p className="text-red-500 text-xs mt-1">{errors.company.phone.message}</p>}
                </div>
              </>
            )}

            {watchRole === 'internal' && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Department</label>
                <input
                  type="text"
                  placeholder="Enter your department"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  {...register("department")}
                />
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
              </div>
            )}

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                {...register("password")}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;