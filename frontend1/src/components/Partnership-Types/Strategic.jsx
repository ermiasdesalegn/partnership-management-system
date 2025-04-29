import React, { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import useMeasure from "react-use-measure";
import { useDragControls, useMotionValue, useAnimate, motion } from "framer-motion";

const DragCloseDrawer = ({ open, setOpen, children }) => {
  const [scope, animate] = useAnimate();
  const [drawerRef, { height }] = useMeasure();

  const y = useMotionValue(0);
  const controls = useDragControls();

  const handleClose = async () => {
    animate(scope.current, {
      opacity: [1, 0],
    });

    const yStart = typeof y.get() === "number" ? y.get() : 0;

    await animate("#drawer", {
      y: [yStart, height],
    });

    setOpen(false);
  };

  return (
    <>
      {open && (
        <motion.div
          ref={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-neutral-950/70"
        >
          <motion.div
            id="drawer"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{
              ease: "easeInOut",
            }}
            className="absolute bottom-0 h-[75vh] w-full overflow-hidden rounded-t-3xl bg-neutral-900"
            style={{ y }}
            drag="y"
            dragControls={controls}
            onDragEnd={() => {
              if (y.get() >= 100) {
                handleClose();
              }
            }}
            dragListener={false}
            dragConstraints={{
              top: 0,
              bottom: 0,
            }}
            dragElastic={{
              top: 0,
              bottom: 0.5,
            }}
          >
            <div className="absolute left-0 right-0 top-0 z-10 flex justify-center bg-neutral-900 p-4">
              <button
                onPointerDown={(e) => {
                  controls.start(e);
                }}
                className="h-2 w-14 cursor-grab touch-none rounded-full bg-neutral-700 active:cursor-grabbing"
              ></button>
            </div>
            <div className="relative z-0 h-full overflow-y-scroll p-4 pt-12">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

const StrategicContent = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
      <h2 className="col-span-1 text-3xl font-bold md:col-span-4">
        Optimizing Everyday Operations
      </h2>
      <div className="col-span-1 md:col-span-8">
        <p className="mb-4 text-xl text-neutral-600 md:text-2xl">
          Operational partnerships focus on streamlining day-to-day activities to ensure seamless processes. They prioritize resource efficiency, consistent workflows, and mutual support to maintain operational excellence.
        </p>
        <p className="mb-8 text-xl text-neutral-600 md:text-2xl">
          These partnerships are essential for organizations looking to improve reliability and performance in their regular operations while reducing costs and enhancing productivity.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded bg-neutral-900 px-9 py-4 text-xl text-white transition-colors hover:bg-neutral-700 md:w-fit"
        >
          Learn more <FiArrowUpRight className="inline" />
        </button>
        <DragCloseDrawer open={open} setOpen={setOpen}>
        <div className="mx-auto max-w-2xl space-y-4 text-neutral-400">
            <h2 className="text-4xl font-bold text-neutral-200">
              Understanding Strategic Partnerships
            </h2>
            <p>
              Operational partnerships focus on creating synergies between organizations that help streamline routine activities. These partnerships enable businesses to focus on their core strengths while relying on the expertise of partners to handle specific operational tasks efficiently.
            </p>
            <p>
              They foster improved resource management, reduce redundancies, and increase overall productivity. By aligning goals and sharing responsibilities, operational partnerships can create a more robust and resilient operational framework, which leads to better service delivery, cost savings, and optimized performance.
            </p>
            <p>
              In addition, operational partnerships can improve reliability by ensuring that each partner contributes their best capabilities. With a focus on shared outcomes, these partnerships build trust and long-term collaboration between businesses that enhance their day-to-day operations.
            </p>
            {/* Add more content here as needed */}
          </div>
        </DragCloseDrawer>
      </div>
    </div>
  );
};

export default StrategicContent;