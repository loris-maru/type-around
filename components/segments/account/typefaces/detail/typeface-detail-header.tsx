"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import {
  RiEyeLine,
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
  viewHref,
  onSave,
  onStatusChange,
  onTogglePublish,
}: TypefaceDetailHeaderProps) {
  return (
    <>
      <div className="mb-8 flex w-full flex-row items-center justify-between">
        <h1 className="font-bold font-ortank text-3xl">
          Type family: {typefaceName}
        </h1>
        <CustomSelect
          value={status}
          options={TYPEFACE_STATUS_OPTIONS}
          onChange={onStatusChange}
        />
      </div>

      {/* Fixed bottom-right buttons */}
      <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3">
        {/* Save button — slides in when there are changes */}
        <AnimatePresence>
          {hasChanges && (
            <motion.button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-black px-6 py-3 text-white shadow-lg transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              <RiSaveLine className="h-5 w-5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </motion.button>
          )}
        </AnimatePresence>

        {/* View page button */}
        <Link
          href={viewHref}
          target="_blank"
          aria-label="View typeface page"
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white px-6 py-3 font-normal font-whisper text-black transition-colors hover:bg-neutral-50"
        >
          <RiEyeLine className="h-5 w-5" />
          View page
        </Link>

        {/* Publish / Live button — always visible */}
        {isPublished ? (
          <button
            type="button"
            onClick={onTogglePublish}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white px-6 py-3 text-black transition-colors hover:bg-neutral-50"
            style={{
              boxShadow:
                "0 0 12px 2px rgba(34, 197, 94, 0.35)",
            }}
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
            Live
          </button>
        ) : (
          <button
            type="button"
            onClick={onTogglePublish}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-black px-6 py-3 text-white shadow-lg transition-colors hover:bg-neutral-800"
          >
            <RiFileUploadLine className="h-5 w-5" />
            Publish
          </button>
        )}
      </div>
    </>
  );
}
