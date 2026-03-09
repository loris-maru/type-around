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
          <div className="rounded-2xl bg-green-600 px-16 py-6 font-whisper text-base text-white">
            Changes saved
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
