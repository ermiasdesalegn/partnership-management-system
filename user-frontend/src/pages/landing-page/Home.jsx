import React from "react";
import Hero from "../../components/home/Hero";
import Explanation from "../../components/home/Explanation";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Explanation />
    </div>
  );
};

export default Home;