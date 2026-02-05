"use client";

import { RiSaveLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react";

interface TypefaceDetailHeaderProps {
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
}

export default function TypefaceDetailHeader({
  hasChanges,
  isSaving,
  onSave,
}: TypefaceDetailHeaderProps) {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-ortank text-2xl font-bold">
          Edit Typeface
        </h1>
      </div>

      {/* Fixed Save Button with spring animation */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              <RiSaveLine className="w-5 h-5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
