"use client";

import { useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/utils/class-names";
import { CollapsibleSectionProps } from "@/types/components";

export default function CollapsibleSection({
  id,
  title,
  count,
  countLabel,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      id={id}
      className="mb-10 scroll-mt-8"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-4 pb-2 border-b border-neutral-200 cursor-pointer group"
      >
        <h2 className="text-xl font-ortank font-bold">
          {title}
          {count !== undefined && countLabel && (
            <span className="text-neutral-500 font-normal ml-2">
              ({count} {countLabel})
            </span>
          )}
        </h2>
        <RiArrowDownSLine
          className={cn(
            "w-5 h-5 text-neutral-500 transition-transform duration-200",
            isOpen && "rotate-180"
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
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
