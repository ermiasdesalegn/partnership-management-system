import Option from "./Option";
import { motion } from "framer-motion";
import TitleSection from "./Title";
import { useState, useEffect } from "react";
import ToggleClose from "./ToggleClose";
import optionsData from "../../data/optionData";
import { useLocation } from "react-router";

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(location.pathname);

  // Check screen size and auto-collapse sidebar on smaller screens
  useEffect(() => {
    const checkScreenSize = () => {
      const isSmallScreen = window.innerWidth < 768; // md breakpoint
      setOpen(!isSmallScreen); // Collapse on small screens, expand on large screens
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white overflow-y-auto"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
        <div className="p-2 h-full flex flex-col">
      <TitleSection open={open} />

          <div className="flex-1 overflow-y-auto pb-16">
      {optionsData.map(({ Icon, title, link, Badge, notifs, dropdown }) => (
        <Option
          key={title}
          Icon={Icon}
          Badge={Badge}
          notifs={notifs}
          title={title}
          link={link}
          selected={selected}
          setSelected={setSelected}
          open={open}
          dropdown={dropdown}
        />
      ))}
          </div>

      <ToggleClose open={open} setOpen={setOpen} />
        </div>
    </motion.nav>
  );
};

export default Sidebar;
