import { motion } from "framer-motion";
import api from "../../../api";
import { useForm } from "react-hook-form";
// import { useState } from "react";
import { useNavigate } from "react-router";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Support = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      await api.post("/support/create", data);
      console.log("Support form submitted successfully!");
      reset();
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (err) {
      console.error(err);
      console.log("Failed to submit support form. Please try again.");
    }
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // const handleSubmit = async (e) => {
  //   console.log("Form data:", formData);
  //   e.preventDefault();
  //   try {
  //     const response = await api.post("/support/create", formData);
  //     console.log("Message sent successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // };

  return (
    <section id="support" className="bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Support
        </h2>
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Support Form
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Fill out the form below to submit a support request.
              </p>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  {...register("name")}
                  placeholder="Enter your name"
                  type="text"
                  id="name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />

                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {`${errors.name.message}`}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {`${errors.email.message}`}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  {...register(
                    // "message"
                    "message"
                  )}
                  id="message"
                  rows="4"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {`${errors.message.message}`}
                  </p>
                )}
              </div>
              <div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-2 px-4 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Support;
