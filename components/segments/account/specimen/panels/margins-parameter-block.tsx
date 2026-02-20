"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  RiLayoutBottom2Line,
  RiLayoutLeft2Line,
  RiLayoutRight2Line,
  RiLayoutTop2Line,
} from "react-icons/ri";
import type { MarginsParameterBlockProps } from "@/types/specimen";
import { getPageMargins } from "@/utils/specimen-utils";
import ParameterBlock from "./parameter-block";

function MarginInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      id={id}
      type="number"
      min={0}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm outline-none focus:border-black"
    />
  );
}

export default function MarginsParameterBlock({
  page,
  onMarginChange,
  onApply,
  expanded,
  onToggle,
}: MarginsParameterBlockProps) {
  const margins = getPageMargins(page);

  const [localMargins, setLocalMargins] = useState({
    left: String(margins.left),
    top: String(margins.top),
    right: String(margins.right),
    bottom: String(margins.bottom),
  });

  const handleApply = () => {
    const parsed = {
      left: Math.max(0, Number(localMargins.left) || 0),
      top: Math.max(0, Number(localMargins.top) || 0),
      right: Math.max(0, Number(localMargins.right) || 0),
      bottom: Math.max(0, Number(localMargins.bottom) || 0),
    };
    if (onApply) {
      onApply(parsed);
    } else {
      onMarginChange("left", parsed.left);
      onMarginChange("top", parsed.top);
      onMarginChange("right", parsed.right);
      onMarginChange("bottom", parsed.bottom);
    }
    setLocalMargins({
      left: String(parsed.left),
      top: String(parsed.top),
      right: String(parsed.right),
      bottom: String(parsed.bottom),
    });
  };

  const hasUnsavedChanges = useMemo(() => {
    const parsed = {
      left: Math.max(0, Number(localMargins.left) || 0),
      top: Math.max(0, Number(localMargins.top) || 0),
      right: Math.max(0, Number(localMargins.right) || 0),
      bottom: Math.max(0, Number(localMargins.bottom) || 0),
    };
    return (
      parsed.left !== margins.left ||
      parsed.top !== margins.top ||
      parsed.right !== margins.right ||
      parsed.bottom !== margins.bottom
    );
  }, [
    localMargins.left,
    localMargins.top,
    localMargins.right,
    localMargins.bottom,
    margins.left,
    margins.top,
    margins.right,
    margins.bottom,
  ]);

  return (
    <ParameterBlock
      title="Margins"
      collapsible
      defaultExpanded
      expanded={expanded}
      onToggle={onToggle}
    >
      <div className="flex flex-col gap-3 pb-2">
        <div className="grid grid-cols-2 gap-3">
          <label
            htmlFor={`margin-left-${page.id}`}
            className="flex items-center gap-2 font-whisper text-neutral-600 text-sm"
          >
            <RiLayoutLeft2Line className="h-4 w-4 shrink-0" />
            <MarginInput
              id={`margin-left-${page.id}`}
              value={localMargins.left}
              onChange={(v) =>
                setLocalMargins((prev) => ({
                  ...prev,
                  left: v,
                }))
              }
            />
          </label>
          <label
            htmlFor={`margin-top-${page.id}`}
            className="flex items-center gap-2 font-whisper text-neutral-600 text-sm"
          >
            <RiLayoutTop2Line className="h-4 w-4 shrink-0" />
            <MarginInput
              id={`margin-top-${page.id}`}
              value={localMargins.top}
              onChange={(v) =>
                setLocalMargins((prev) => ({
                  ...prev,
                  top: v,
                }))
              }
            />
          </label>
          <label
            htmlFor={`margin-right-${page.id}`}
            className="flex items-center gap-2 font-whisper text-neutral-600 text-sm"
          >
            <RiLayoutRight2Line className="h-4 w-4 shrink-0" />
            <MarginInput
              id={`margin-right-${page.id}`}
              value={localMargins.right}
              onChange={(v) =>
                setLocalMargins((prev) => ({
                  ...prev,
                  right: v,
                }))
              }
            />
          </label>
          <label
            htmlFor={`margin-bottom-${page.id}`}
            className="flex items-center gap-2 font-whisper text-neutral-600 text-sm"
          >
            <RiLayoutBottom2Line className="h-4 w-4 shrink-0" />
            <MarginInput
              id={`margin-bottom-${page.id}`}
              value={localMargins.bottom}
              onChange={(v) =>
                setLocalMargins((prev) => ({
                  ...prev,
                  bottom: v,
                }))
              }
            />
          </label>
        </div>
        <AnimatePresence initial={false}>
          {hasUnsavedChanges && (
            <motion.button
              type="button"
              onClick={handleApply}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="w-full rounded-lg border border-neutral-300 py-2 font-whisper text-neutral-600 text-sm transition-colors hover:border-black hover:bg-neutral-50"
            >
              Apply
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </ParameterBlock>
  );
}
