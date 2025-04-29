import React from "react";
import { motion } from "framer-motion";
import INSAlogo from "../../assets/partnership-types-images/INSAlogo.jpeg";

const PartnerLinks = ({ scrollToSection, strategicRef, operationalRef, projectRef, tacticalRef }) => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 text-slate-800">
      <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-end md:px-8">
      <img src={INSAlogo} alt="INSA Logo" className="h-28" />
        <h2 className="max-w-lg text-4xl font-bold md:text-5xl">
          INSA
          <span className="text-slate-400"> offers four types of Partnerships</span>
        </h2>
      </div>
      <div className="mb-4 grid grid-cols-12 gap-4">
        <BounceCard className="col-span-12 md:col-span-3" onClick={() => scrollToSection(strategicRef)}>
          <CardTitle>Strategic Partnership</CardTitle>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-violet-400 to-indigo-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-indigo-50">
              Click here to learn more
            </span>
          </div>
        </BounceCard>
        <BounceCard className="col-span-12 md:col-span-3" onClick={() => scrollToSection(operationalRef)}>
          <CardTitle>Operational Partnership</CardTitle>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-amber-400 to-orange-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-orange-50">
              Click here to learn more
            </span>
          </div>
        </BounceCard>
        <BounceCard className="col-span-12 md:col-span-3" onClick={() => scrollToSection(projectRef)}>
          <CardTitle>Project Partnership</CardTitle>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-green-400 to-teal-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-teal-50">
              Click here to learn more
            </span>
          </div>
        </BounceCard>
        <BounceCard className="col-span-12 md:col-span-3" onClick={() => scrollToSection(tacticalRef)}>
          <CardTitle>Tactical Partnership</CardTitle>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-pink-400 to-red-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-red-50">
              Click here to learn more
            </span>
          </div>
        </BounceCard>
      </div>
    </section>
  );
};

const BounceCard = ({ className, children, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 0.95, rotate: "-1deg" }}
      className={`group relative min-h-[300px] cursor-pointer overflow-hidden rounded-2xl bg-slate-100 p-8 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

const CardTitle = ({ children }) => {
  return (
    <h3 className="mx-auto text-center text-3xl font-semibold">{children}</h3>
  );
};

export default PartnerLinks;