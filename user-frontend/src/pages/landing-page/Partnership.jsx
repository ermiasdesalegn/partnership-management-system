/* eslint-disable react/prop-types */
import  { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import StrategicContent from "../../components/Partnership-Types/Strategic";
import TacticalContent from "../../components/Partnership-Types/Tactical";
import OperationalContent from "../../components/Partnership-Types/Operational";
import ProjectContent from "../../components/Partnership-Types/Project";
import strategicimg from "../../assets/partnership-types-images/strategic.jpeg";
import tacticalimg from "../../assets/partnership-types-images/tactical.jpg";
import operationalimg from "../../assets/partnership-types-images/operational.jpeg";
import HeroSection from "../../components/Partnership-Types/Hero";
import PartnerLinks from "../../components/Partnership-Types/PartnerLinks";
import BackToTop from "../../components/common/BackToTop";

export default function Partnership() {
  const strategicRef = useRef(null);
  const operationalRef = useRef(null);
  const projectRef = useRef(null);
  const tacticalRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-b from-white via-[#3c8dbc]/5 to-white m-0 p-0">
      <HeroSection />
      <PartnerLinks
        scrollToSection={scrollToSection}
        strategicRef={strategicRef}
        operationalRef={operationalRef}
        projectRef={projectRef}
        tacticalRef={tacticalRef}
      />
      <div className="bg-transparent">
        <div ref={strategicRef}>
          <TextParallaxContent
            imgUrl={strategicimg}
            subheading="Collaborate for Lasting Impact"
            heading="Strategic Partnerships"
          >
            <StrategicContent />
          </TextParallaxContent>
        </div>
        <div ref={operationalRef}>
          <TextParallaxContent
            imgUrl={operationalimg}
            subheading="Streamline Daily Success"
            heading="Operational Partnerships"
          >
            <OperationalContent />
          </TextParallaxContent>
        </div>
        <div ref={projectRef}>
          <TextParallaxContent
            imgUrl="https://images.unsplash.com/photo-1504610926078-a1611febcad3?q=80&w=2416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            subheading="Innovate with Purpose"
            heading="Project Partnerships"
          >
            <ProjectContent />
          </TextParallaxContent>
        </div>
        <div ref={tacticalRef}>
          <TextParallaxContent
            imgUrl={tacticalimg}
            subheading="Achieve Precision and Results"
            heading="Tactical Partnerships"
          >
            <TacticalContent />
          </TextParallaxContent>
        </div>
      </div>
      <BackToTop />
    </div>
  );
}

const IMG_PADDING = 12;

const TextParallaxContent = ({ imgUrl, subheading, heading, children }) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg -mt-20 relative z-10 mx-8 border border-[#3c8dbc]/20">
        {children}
      </div>
    </div>
  );
};

const StickyImage = ({ imgUrl }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl border-2 border-[#3c8dbc]/30 shadow-xl"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#3c8dbc]/70 to-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({ subheading, heading }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl text-[#3c8dbc]/90 font-light">
        {subheading}
      </p>
      <p className="text-center text-4xl font-bold md:text-7xl text-white drop-shadow-lg">
        {heading}
      </p>
    </motion.div>
  );
};