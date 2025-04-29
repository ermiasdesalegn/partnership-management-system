import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const steps = [
  {
    title: "Register",
    description: "Create your account with basic information",
  },
  {
    title: "Complete Profile",
    description: "Add your business details and documents",
  },
  {
    title: "Submit Application",
    description: "Fill out the partnership request form",
  },
  {
    title: "Review Process",
    description: "Our team will evaluate your application",
  },
  {
    title: "Approval",
    description: "Get notified about your application status",
  },
  {
    title: "Onboarding",
    description: "Start your partnership journey with INSA",
  },
];

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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const HowTo = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            How to Become a Partner
          </h2>
          <p className="text-lg text-gray-600">
            Follow these simple steps to start your partnership
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="text-blue-600 text-2xl">
                  <FaCheckCircle />
                </div>
                <div>
                  <div className="text-xl font-light text-gray-900 mb-2">
                    {step.title}
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowTo;