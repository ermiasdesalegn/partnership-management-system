import React from "react"
import {FaEye} from "react-icons/fa"
import { motion } from "framer-motion";
import strategicImg from '../../assets/partnership-types-images/strategic.jpeg';

const Vision = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, boxShadow: "0 8px 32px 0 rgba(60,141,188,0.15)" }}
      className='flex flex-col md:flex-row items-center md:w-full p-6 bg-white shadow-xl rounded-[1.5rem] border-l-8 border-[#3c8dbc] gap-6 transition-transform duration-300'
    >
      <img src={strategicImg} alt="Vision" className="w-32 h-32 object-cover rounded-xl shadow-lg mb-4 md:mb-0 md:mr-6 border-4 border-[#3c8dbc]" />
      <div className="flex-1">
        <h1 className='font-poppins text-3xl md:text-4xl font-bold text-[#3c8dbc] tracking-wide mb-4'>Our Vision</h1>
        <div className='space-y-4'>
          <p className='font-poppins text-lg text-gray-700 font-light leading-relaxed'>
            At the heart of our mission, we strive to revolutionize partnership
            management through innovative AI-driven solutions. We envision a
            future where organizations can manage their partnerships seamlessly,
            unlocking new opportunities for collaboration and growth.
          </p>
          <p className='font-poppins text-lg text-gray-700 font-light leading-relaxed'>
            By fostering strategic partnerships and embracing cutting-edge
            technologies, we aim to empower organizations to thrive in an
            interconnected world, driving efficiency and sustainability in every
            partnership we support.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Vision
