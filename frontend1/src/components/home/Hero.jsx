import React, { useEffect } from "react";
import { Link } from "react-router";
import ScrollReveal from "scrollreveal";
import article1 from '../../assets/article.jpg';
import article2 from '../../assets/article2.jpeg';
import article3 from '../../assets/article3.jpeg';

const Hero = () => {
  useEffect(() => {
    const sr = ScrollReveal({
      origin: 'bottom',
      distance: '60px',
      duration: 1000,
      delay: 200,
      reset: false
    });

    sr.reveal('.hero-content', { delay: 300 });
    sr.reveal('.hero-image-1', { delay: 400 });
    sr.reveal('.hero-image-2', { delay: 500 });
    sr.reveal('.hero-image-3', { delay: 600 });

    return () => {
      sr.destroy();
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3c8dbc]/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2c6a8f]/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-16 gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-6 hero-content">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Transform Your <span className="text-[#3c8dbc]">Partnerships</span> with Smart Solutions
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              Streamline your partnership management with our comprehensive platform. From onboarding to performance tracking, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="signup"
                className="px-7 py-3.5 text-base font-medium text-white rounded-full bg-gradient-to-r from-[#3c8dbc] to-[#2c6a8f] hover:from-[#367fa9] hover:to-[#3c8dbc] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Get Started
              </Link>
              <Link
                to="about"
                className="px-7 py-3.5 text-base font-medium text-[#3c8dbc] rounded-full bg-white hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Content - Creative Image Layout */}
          <div className="lg:w-1/2 relative">
            {/* Main Image */}
            <div className="relative hero-image-1 mb-8">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#3c8dbc]/10 rounded-full blur-xl"></div>
              <img 
                src={article1} 
                alt="Partnership Management" 
                className="w-full h-[400px] object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#2c6a8f]/10 rounded-full blur-xl"></div>
            </div>

            {/* Secondary Images */}
            <div className="flex gap-4">
              <div className="relative hero-image-2 w-1/2">
                <img 
                  src={article2} 
                  alt="Team Collaboration" 
                  className="w-full h-48 object-cover rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[#3c8dbc]/10 rounded-full blur-xl"></div>
              </div>
              <div className="relative hero-image-3 w-1/2">
                <img 
                  src={article3} 
                  alt="Performance Tracking" 
                  className="w-full h-48 object-cover rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-[#2c6a8f]/10 rounded-full blur-xl"></div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-xl p-5 flex gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3c8dbc]">500+</div>
                <div className="text-gray-600 text-sm">Active Partners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3c8dbc]">98%</div>
                <div className="text-gray-600 text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3c8dbc]">24/7</div>
                <div className="text-gray-600 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
