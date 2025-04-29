import React, { useState, useEffect } from "react";
import image1 from "../../assets/partnership-types-images/hero1.png";
import image2 from "../../assets/partnership-types-images/hero2.png";
import image3 from "../../assets/partnership-types-images/hero3.png";
import image4 from "../../assets/partnership-types-images/hero4.png";
import image5 from "../../assets/partnership-types-images/hero5.png";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const images = [image1, image2, image3, image4, image5];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative h-screen text-white text-left flex justify-start mb-5 mt-8 items-center lg:px-0 px-8 md:px-16 overflow-hidden">
      {/* Hero Image */}
      <div
        className="absolute inset-0 w-full h-full object-cover transition-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${images[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="relative w-full md:w-[54%] ml-0 md:ml-24 z-10 text-left">
        <h1 className="font-manrope font-semibold text-[2rem] md:text-[2.8rem] leading-tight md:leading-snug">
          Partnering Business Organizations with INSA: Ethiopian Leading Security Agency for a Safer Tomorrow.
        </h1>
        <div className="flex gap-4 mt-6 font-Manrope items-start">
          <a href="">
            <Link to="/signup"
              // type="button"
              className="bg-[#1f88d8] cursor-pointer px-6 py-2 md:px-7 md:py-2.5 rounded-lg text-[0.8rem] md:text-[1rem]" 
            >
              Become a partner
            </Link>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
