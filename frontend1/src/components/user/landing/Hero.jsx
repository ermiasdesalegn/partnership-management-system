import article1 from "../../../assets/article1.jpg";
import article2 from "../../../assets/article2.jpeg";
import article3 from "../../../assets/article3.jpeg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233c8dbc' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-light text-gray-900 leading-tight tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Secure Your Digital Future with <span className="text-[#3c8dbc] font-normal">INSA</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 max-w-lg leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Ethiopia's leading cybersecurity authority, protecting national digital infrastructure and ensuring secure digital transformation.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/user/request"
                className="px-8 py-4 bg-[#3c8dbc] text-white rounded-md hover:bg-[#367fa9] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg font-medium"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Request Form
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-white text-[#3c8dbc] border border-[#3c8dbc] rounded-md hover:bg-[#f5f5f5] transition-all duration-300 transform hover:scale-105 text-lg font-medium"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative h-64 rounded-lg overflow-hidden shadow-lg group"
              >
                <div className="absolute inset-0 bg-[#3c8dbc] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <img 
                  src={article1} 
                  alt="Cybersecurity Solutions" 
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative h-48 rounded-lg overflow-hidden shadow-lg group"
              >
                <div className="absolute inset-0 bg-[#3c8dbc] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <img 
                  src={article2} 
                  alt="Information Security" 
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative h-full rounded-lg overflow-hidden shadow-lg group"
            >
              <div className="absolute inset-0 bg-[#3c8dbc] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <img 
                src={article3} 
                alt="National Security" 
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
