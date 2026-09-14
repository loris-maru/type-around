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
import { cn } from "@/utils/class-names";

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
      <header className="swiss-rule mb-12 grid w-full grid-cols-12 gap-x-6 pt-3">
        <div className="col-span-8">
          <div className="swiss-label mb-6 flex items-center gap-2 text-neutral-500">
            <span className="inline-block h-2 w-2 bg-swiss-red" />
            04 Typefaces / Type family
          </div>
          <h1 className="swiss-display">{typefaceName}</h1>
        </div>
        <div className="col-span-4 flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            <span className="swiss-label text-neutral-500">
              Status
            </span>
            <CustomSelect
              value={status}
              options={TYPEFACE_STATUS_OPTIONS}
              onChange={onStatusChange}
            />
          </div>
          <div
            className={cn(
              "swiss-label flex items-center gap-2",
              isPublished
                ? "text-black"
                : "text-neutral-400"
            )}
          >
            <span
              className={cn(
                "inline-block h-2 w-2",
                isPublished
                  ? "bg-swiss-red"
                  : "bg-neutral-300"
              )}
            />
            {isPublished ? "Live" : "Unpublished"}
          </div>
        </div>
      </header>

      {/* Fixed bottom-right action bar */}
      <div className="fixed right-6 bottom-6 z-50 flex items-stretch">
        <AnimatePresence>
          {hasChanges && (
            <motion.button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="swiss-btn swiss-btn-red min-h-12 px-6"
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              <RiSaveLine className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save changes"}
            </motion.button>
          )}
        </AnimatePresence>

        <Link
          href={viewHref}
          target="_blank"
          aria-label="View typeface page"
          className="swiss-btn -ml-px min-h-12 px-6"
        >
          <RiEyeLine className="h-4 w-4" />
          View page
        </Link>

        <button
          type="button"
          onClick={onTogglePublish}
          className={cn(
            "swiss-btn -ml-px min-h-12 px-6",
            !isPublished && "swiss-btn-solid"
          )}
        >
          {isPublished ? (
            <>
              <span className="inline-block h-2 w-2 bg-swiss-red" />
              Live
            </>
          ) : (
            <>
              <RiFileUploadLine className="h-4 w-4" />
              Publish
            </>
          )}
        </button>
      </div>
    </>
  );
}
