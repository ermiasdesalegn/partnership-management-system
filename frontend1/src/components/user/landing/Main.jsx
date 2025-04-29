import React from 'react';
import { motion } from "framer-motion";
import { FaShieldAlt, FaChartLine, FaHandshake } from "react-icons/fa";

const benefits = [
  {
    icon: <FaShieldAlt />,
    title: "Enhanced Security",
    description: "Implement state-of-the-art security solutions to protect your assets"
  },
  {
    icon: <FaChartLine />,
    title: "Business Growth",
    description: "Expand your market reach with INSA's established network"
  },
  {
    icon: <FaHandshake />,
    title: "Strategic Partnership",
    description: "Build long-term relationships with industry leaders"
  }
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

function Main() {
  return (
    <section className='py-20 bg-gradient-to-b from-gray-50 to-white'>
      <div className='container mx-auto px-4'>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center mb-12'
        >
          <h2 className='text-3xl font-light text-gray-900 mb-4'>
            Partner Benefits
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Join forces with INSA to enhance your security infrastructure and grow your business
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className='grid md:grid-cols-3 gap-8'
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className='bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100'
            >
              <div className='text-4xl text-blue-600 mb-4'>
                {benefit.icon}
              </div>
              <h3 className='text-xl font-light mb-2'>{benefit.title}</h3>
              <p className='text-gray-600'>{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Main;
