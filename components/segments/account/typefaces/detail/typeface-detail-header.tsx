"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  RiFileUploadLine,
  RiSaveLine,
} from "react-icons/ri";
import CustomSelect from "@/components/global/custom-select";
import { TYPEFACE_STATUS_OPTIONS } from "@/constant/TYPEFACE_STATUS";
import type { TypefaceDetailHeaderProps } from "@/types/components";

export default function TypefaceDetailHeader({
  typefaceName,
  status,
  hasChanges,
  isSaving,
  isPublished,
  onSave,
  onStatusChange,
  onTogglePublish,
}: TypefaceDetailHeaderProps) {
  return (
    <>
      <div className="flex w-full flex-row justify-between items-center mb-8">
        <h1 className="font-ortank text-3xl font-bold">
          Type family: {typefaceName}
        </h1>
        <CustomSelect
          value={status}
          options={TYPEFACE_STATUS_OPTIONS}
          onChange={onStatusChange}
        />
      </div>

      {/* Fixed bottom-right buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Save button — slides in when there are changes */}
        <AnimatePresence>
          {hasChanges && (
            <motion.button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors shadow-lg cursor-pointer"
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              <RiSaveLine className="w-5 h-5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Publish / Live button — always visible */}
        {isPublished ? (
          <button
            type="button"
            onClick={onTogglePublish}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
            style={{
              boxShadow:
                "0 0 12px 2px rgba(34, 197, 94, 0.35)",
            }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            Live
          </button>
        ) : (
          <button
            type="button"
            onClick={onTogglePublish}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors shadow-lg cursor-pointer"
          >
            <RiFileUploadLine className="w-5 h-5" />
            Publish
          </button>
        )}
      </div>
    </>
  );
}
