import Option from "./Option";
import { motion } from "framer-motion";
import TitleSection from "./Title";
import { useState } from "react";
import ToggleClose from "./ToggleClose";
import optionsData from "../../data/optionData";
import { useLocation } from "react-router";

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(location.pathname);

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <TitleSection open={open} />

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

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

export default Sidebar;
