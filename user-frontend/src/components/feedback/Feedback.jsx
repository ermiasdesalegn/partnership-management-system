import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import feedbackService from "../../services/feedback-service";
import { toast } from "react-toastify";

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

const Feedback = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        rating,
      };
      
      const response = await feedbackService.create(formData);
      
      if (response.status === 'success') {
        toast.success("Thank you for your feedback!");
        reset();
        setRating(0);
        setTimeout(() => {
          navigate('/user');
        }, 2000);
      } else {
        toast.error(response.message || "Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to submit feedback. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Share Your Feedback
        </h2>
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              We Value Your Feedback
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Help us improve by sharing your thoughts and suggestions.
              </p>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter your name"
                  type="text"
                  id="name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
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
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <FaStar
                        key={index}
                        className="cursor-pointer text-2xl transition-colors duration-200"
                        color={
                          ratingValue <= (hover || rating)
                            ? "#ffc107"
                            : "#e4e5e9"
                        }
                        onClick={() => setRating(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                      />
                    );
                  })}
                </div>
                {rating === 0 && (
                  <p className="text-red-500 text-xs mt-1">
                    Please provide a rating
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Feedback
                </label>
                <textarea
                  {...register("message", { required: "Feedback is required" })}
                  id="message"
                  rows="4"
                  placeholder="Share your thoughts and suggestions"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-2 px-4 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Feedback; 