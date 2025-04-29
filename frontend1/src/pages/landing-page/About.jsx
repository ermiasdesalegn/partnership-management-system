import React from "react";
import News from "../../components/about/news"
import Vision from "../../components/about/Vision"
import Mission from "../../components/about/Mission"

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#3c8dbc]/5 to-white animate-gradient-y"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiA0NGMwIDYuNjI3LTUuMzczIDEyLTEyIDEyUzEyIDUwLjYyNyAxMiA0NCAxNy4zNzMgMzIgMjQgMzJzMTIgNS4zNzMgMTIgMTJ6IiBmaWxsPSIjM2M4ZGJjIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

        <div className="relative z-10">
          <News />
          <h1 className="text-center mb-12 text-4xl md:text-5xl font-bold text-gray-900 relative" style={{ fontFamily: "'Playfair Display', serif" }}>
            Our Vision and Mission
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#3c8dbc] to-[#2c6a8f] rounded-full"></div>
          </h1>
          <div className="flex flex-col md:mx-20 lg:flex-row lg:m-0 gap-8 pb-20 px-4">
            <Vision />
            <Mission />
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
