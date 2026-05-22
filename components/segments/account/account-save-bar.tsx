"use client";

import { AnimatePresence, motion } from "motion/react";
import { ButtonSaveChanges } from "@/components/molecules/buttons";

type AccountSaveBarProps = {
  visible: boolean;
  isSaving: boolean;
  onSave: () => void;
  label?: string;
};

export default function AccountSaveBar({
  visible,
  isSaving,
  onSave,
  label = "Save",
}: AccountSaveBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
        >
          <ButtonSaveChanges
            onClick={onSave}
            disabled={isSaving}
            label={label}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
