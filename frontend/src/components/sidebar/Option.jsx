/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";

const Option = ({
  Icon,
  title,
  link,
  selected,
  setSelected,
  open,
  notifs,
  dropdown,
}) => {
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const toggleDropDown = (e) => {
    e.stopPropagation(); // Prevents unwanted bubbling
    setDropDownOpen((prev) => !prev);
  };

  if (dropdown) {
    return (
      <div className="w-full mb-1">
        <motion.button
          layout
          onClick={toggleDropDown}
          className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
            selected === link
              ? "bg-indigo-100 text-indigo-800"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <motion.div
            layout
            className="grid h-full w-10 place-content-center text-lg flex-shrink-0"
          >
            <Icon />
          </motion.div>
          {open && (
            <motion.span
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
              className="text-xs font-medium flex-1 text-left"
            >
              {title}
            </motion.span>
          )}

          {open && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex-shrink-0 mr-2 text-indigo-500"
            >
              {dropDownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </motion.span>
          )}
        </motion.button>

        {dropDownOpen && open && (
          <motion.nav
            layout
            className="ml-6 mt-2 border-l border-gray-300 bg-gray-50 p-2 rounded-lg"
          >
            {dropdown.map(({ link, title, notifs }) => (
              <Link key={title} to={link.toLowerCase()} className="block">
                <motion.button
                  layout
                  onClick={() => setSelected(link)}
                  className={`relative flex h-10 w-full items-center rounded-md transition-colors px-4 mb-1 ${
                    selected === link
                      ? "bg-indigo-100 text-indigo-800"
                      : "text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <motion.div
                    layout
                    className="grid h-full w-6 place-content-center text-sm flex-shrink-0"
                  >
                    <Icon />
                  </motion.div>
                  <motion.span
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.125 }}
                    className="text-xs font-medium ml-2 flex-1 text-left"
                  >
                    {title}
                  </motion.span>

                  {notifs && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex-shrink-0 size-4 rounded bg-indigo-500 text-xs text-white flex items-center justify-center"
                    >
                      {notifs}
                    </motion.span>
                  )}
                </motion.button>
              </Link>
            ))}
          </motion.nav>
        )}
      </div>
    );
  }

  return (
    <Link to={link.toLowerCase()} className="block mb-1">
      <motion.button
        layout
        onClick={() => setSelected(link)}
        className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
          selected === link
            ? "bg-indigo-100 text-indigo-800"
            : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        <motion.div
          layout
          className="grid h-full w-10 place-content-center text-lg flex-shrink-0"
        >
          <Icon />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium flex-1 text-left"
          >
            {title}
          </motion.span>
        )}

        {notifs && open && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex-shrink-0 mr-2 size-4 rounded bg-indigo-500 text-xs text-white flex items-center justify-center"
          >
            {notifs}
          </motion.span>
        )}
      </motion.button>
    </Link>
  );
};

export default Option;
