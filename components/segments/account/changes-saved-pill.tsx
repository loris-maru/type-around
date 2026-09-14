"use client";

import { AnimatePresence, motion } from "motion/react";

type ChangesSavedPillProps = {
  show: boolean;
};

export default function ChangesSavedPill({
  show,
}: ChangesSavedPillProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed right-6 bottom-6 z-50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
        >
          <div
            role="status"
            className="swiss-label flex min-h-12 items-center gap-3 bg-black px-6 text-white"
          >
            <span className="inline-block h-2 w-2 bg-swiss-red" />
            Changes saved
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
