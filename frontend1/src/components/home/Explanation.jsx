import React from 'react'
import landingImage from '../../assets/partnership-types-images/landingImage.jpg';  // ✅ Correct import'
import Explanation2 from '../../assets/partnership-types-images/operational.jpeg';  // ✅ Correct import'
import Explanation3 from '../../assets/partnership-types-images/strategic.jpeg';  // ✅ Correct import'

function Explanation() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#3c8dbc]/5 to-white animate-gradient-y"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiA0NGMwIDYuNjI3LTUuMzczIDEyLTEyIDEyUzEyIDUwLjYyNyAxMiA0NCAxNy4zNzMgMzIgMjQgMzJzMTIgNS4zNzMgMTIgMTJ6IiBmaWxsPSIjM2M4ZGJjIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-16 relative" style={{ fontFamily: "'Playfair Display', serif" }}>
          Why Partner With Us
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#3c8dbc] to-[#2c6a8f] rounded-full"></div>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="relative overflow-hidden rounded-xl mb-6">
              <img 
                src={landingImage} 
                alt="Efficient Process" 
                className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Efficient Process</h3>
            <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Streamlined workflow for quick and easy request submission
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="relative overflow-hidden rounded-xl mb-6">
              <img 
                src={Explanation2} 
                alt="Real-time Tracking" 
                className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Real-time Tracking</h3>
            <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Monitor your request status in real-time
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="relative overflow-hidden rounded-xl mb-6">
              <img 
                src={Explanation3} 
                alt="Secure Platform" 
                className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Secure Platform</h3>
            <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Enterprise-grade security for your documents
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Explanation
