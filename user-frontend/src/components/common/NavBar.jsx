import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#3c8dbc] shadow-lg mb-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-light text-white hover:text-gray-100 transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>
            PMS
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-gray-100 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-gray-100 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
              About
            </Link>
            <Link to="/partnership" className="text-white hover:text-gray-100 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
              Partnership
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-white text-[#3c8dbc] rounded-lg hover:bg-gray-100 transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-4">
            <Link
              to="/"
              className="block text-white hover:text-gray-100 transition-colors duration-300 pl-2 border-l-2 border-transparent hover:border-white"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block text-white hover:text-gray-100 transition-colors duration-300 pl-2 border-l-2 border-transparent hover:border-white"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              About
            </Link>
            <Link
              to="/partnership"
              className="block text-white hover:text-gray-100 transition-colors duration-300 pl-2 border-l-2 border-transparent hover:border-white"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Partnership
            </Link>
            <Link
              to="/signup"
              className="block px-6 py-2 bg-white text-[#3c8dbc] rounded-lg hover:bg-gray-100 transition-colors duration-300 text-center"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
