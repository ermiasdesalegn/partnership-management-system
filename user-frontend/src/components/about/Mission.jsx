import React, { useEffect } from "react";
import ScrollReveal from "scrollreveal";
import { motion } from "framer-motion";
import operationalImg from '../../assets/partnership-types-images/operational.jpeg';

const Mission = () => {
  useEffect(() => {
    ScrollReveal().reveal(".mission-container", {
      duration: 1200,
      distance: "50px",
      easing: "ease-in-out",
      origin: "bottom",
      reset: true,
    });
    ScrollReveal().reveal(".mission-title", {
      duration: 1000,
      delay: 200,
      origin: "left",
      distance: "40px",
    });
    ScrollReveal().reveal(".mission-text", {
      duration: 1200,
      delay: 400,
      origin: "right",
      distance: "40px",
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, boxShadow: "0 8px 32px 0 rgba(60,141,188,0.15)" }}
      className='flex flex-col md:flex-row items-center md:w-full p-6 bg-white shadow-xl rounded-[1.5rem] border-l-8 border-[#3c8dbc] gap-6 transition-transform duration-300'
    >
      <img src={operationalImg} alt="Mission" className="w-32 h-32 object-cover rounded-xl shadow-lg mb-4 md:mb-0 md:mr-6 border-4 border-[#3c8dbc]" />
      <div className="flex-1">
        <h1 className='font-poppins text-3xl md:text-4xl font-bold text-[#3c8dbc] tracking-wide mb-4'>Our Mission</h1>
        <div className='space-y-4'>
          <p className='font-poppins text-lg text-gray-700 font-light leading-relaxed'>
            Our mission is to streamline partnership management by providing
            organizations with advanced solutions that foster collaboration and
            drive strategic growth. We are dedicated to creating a sustainable
            future through technology and effective partnership ecosystems.
          </p>
          <p className='font-poppins text-lg text-gray-700 font-light leading-relaxed'>
            By empowering organizations with the tools they need to manage
            partnerships effectively, we aim to contribute to the growth of the
            digital economy, enabling success and fostering long-term
            collaboration across sectors.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Mission;
