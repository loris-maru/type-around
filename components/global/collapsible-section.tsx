"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { RiArrowDropRightLine } from "react-icons/ri";
import type { CollapsibleSectionProps } from "@/types/components";
import { cn } from "@/utils/class-names";

export default function CollapsibleSection({
  id,
  title,
  count,
  countLabel,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <section
      {...(id && { id })}
      className="scroll-mt-8"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between border-b border-neutral-200 cursor-pointer group",
          isOpen ? "mb-4 pb-2" : "mb-4 pb-4"
        )}
      >
        <h2 className="text-xl font-ortank font-bold">
          {title}
          {count !== undefined && countLabel && (
            <span className="text-neutral-500 font-whisper text-sm font-normal ml-2">
              ({count} {countLabel})
            </span>
          )}
        </h2>
        <RiArrowDropRightLine
          className={cn(
            "w-5 h-5 text-neutral-500 transition-transform duration-200",
            isOpen && "rotate-90"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() =>
              setIsAnimating(false)
            }
            className={
              isAnimating
                ? "overflow-hidden"
                : "overflow-visible"
            }
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
