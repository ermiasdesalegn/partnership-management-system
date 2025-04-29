import React from "react";
import { motion } from "framer-motion";

function Partners() {
  const partners = [
    {
      id: 1,
      title: "Cybersecurity Solutions",
      description: "Advanced protection for your digital assets",
      icon: "🛡️",
    },
    {
      id: 2,
      title: "Information Security",
      description: "Comprehensive data protection services",
      icon: "🔒",
    },
    {
      id: 3,
      title: "National Security",
      description: "Safeguarding critical infrastructure",
      icon: "🌐",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#3c8dbc]/5 to-white animate-gradient-y"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiA0NGMwIDYuNjI3LTUuMzczIDEyLTEyIDEyUzEyIDUwLjYyNyAxMiA0NCAxNy4zNzMgMzIgMjQgMzJzMTIgNS4zNzMgMTIgMTJ6IiBmaWxsPSIjM2M4ZGJjIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-light text-gray-900 mb-4 relative inline-block">
            Our Core Services
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#3c8dbc] to-transparent"></span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive security solutions for Ethiopia's digital future
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(60, 141, 188, 0.1), 0 10px 10px -5px rgba(60, 141, 188, 0.04)"
              }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative space-y-4">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {partner.icon}
                </div>
                <h3 className="text-xl font-light text-gray-900">
                  {partner.title}
                </h3>
                <p className="text-gray-600">
                  {partner.description}
                </p>
                <div className="pt-4">
                  <span className="inline-block w-12 h-1 bg-gradient-to-r from-[#3c8dbc] to-transparent transform group-hover:scale-x-150 transition-transform duration-300"></span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Partners;
