"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { RiAddLine, RiSubtractLine } from "react-icons/ri";
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
  const Icon = isOpen ? RiSubtractLine : RiAddLine;

  return (
    <section
      {...(id && { id })}
      className="swiss-rule scroll-mt-8 pt-3"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={cn(
          "group flex w-full cursor-pointer items-start justify-between gap-6 text-left",
          isOpen ? "mb-8" : "mb-4"
        )}
      >
        <h2 className="swiss-h2 flex items-baseline gap-4">
          {title}
          {count !== undefined && countLabel && (
            <span className="swiss-label text-neutral-500">
              {count} {countLabel}
            </span>
          )}
        </h2>
        <Icon
          aria-hidden
          className="mt-1 h-4 w-4 shrink-0 text-neutral-400 transition-colors group-hover:text-black"
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
            className={cn(
              "pb-12",
              isAnimating
                ? "overflow-hidden"
                : "overflow-visible"
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
