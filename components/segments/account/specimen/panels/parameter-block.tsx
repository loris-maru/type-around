"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import type { ParameterBlockProps } from "@/types/specimen";
import { cn } from "@/utils/class-names";

export default function ParameterBlock({
  title,
  children,
  collapsible = false,
  defaultExpanded = true,
  expanded: controlledExpanded,
  onToggle,
}: ParameterBlockProps) {
  const [internalExpanded, setInternalExpanded] =
    useState(defaultExpanded);
  const isControlled =
    controlledExpanded !== undefined &&
    onToggle !== undefined;
  const isExpanded = isControlled
    ? controlledExpanded
    : internalExpanded;

  const header = (
    <div className="mb-2 font-whisper text-neutral-600 text-sm">
      {title}
    </div>
  );

  const handleToggle = () => {
    if (isControlled) onToggle?.();
    else setInternalExpanded((prev) => !prev);
  };

  const headerButton = (
    <button
      type="button"
      onClick={handleToggle}
      className="mb-4 flex w-full items-center justify-between font-whisper text-neutral-600 text-sm transition-colors hover:text-neutral-800"
      aria-expanded={isExpanded}
    >
      <span>{title}</span>
      <RiArrowDownSLine
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isExpanded && "rotate-180"
        )}
      />
    </button>
  );

  return (
    <div
      className={cn(
        !collapsible || isExpanded ? "mb-3" : ""
      )}
    >
      {collapsible ? headerButton : header}
      {collapsible ? (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              className="overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        children
      )}
    </div>
  );
}
