"use client";

import {
  RiLayoutBottom2Line,
  RiLayoutLeft2Line,
  RiLayoutRight2Line,
  RiLayoutTop2Line,
} from "react-icons/ri";
import type { MarginsParameterBlockProps } from "@/types/specimen";
import type {
  SpecimenPage,
  SpecimenPageMargins,
} from "@/types/studio";
import ParameterBlock from "./parameter-block";

const DEFAULT_MARGINS: SpecimenPageMargins = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

function getPageMargins(
  page: SpecimenPage
): SpecimenPageMargins {
  return page.margins ?? DEFAULT_MARGINS;
}

export default function MarginsParameterBlock({
  page,
  onMarginChange,
  expanded,
  onToggle,
}: MarginsParameterBlockProps) {
  const margins = getPageMargins(page);

  return (
    <ParameterBlock
      title="Margins"
      collapsible
      defaultExpanded
      expanded={expanded}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-2 gap-3">
        <label
          htmlFor={`margin-left-${page.id}`}
          className="flex items-center gap-2 font-whisper text-neutral-600 text-sm"
        >
          <RiLayoutLeft2Line className="h-4 w-4 shrink-0" />
          <input
            id={`margin-left-${page.id}`}
            type="number"
            min={0}
            value={margins.left}
            onChange={(e) =>
              onMarginChange(
                "left",
                Number(e.target.value) || 0
              )
            }
            className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm outline-none focus:border-black"
          />
        </label>
        <label
          htmlFor={`margin-top-${page.id}`}
          className="flex items-center gap-2 font-whisper text-neutral-600 text-sm"
        >
          <RiLayoutTop2Line className="h-4 w-4 shrink-0" />
          <input
            id={`margin-top-${page.id}`}
            type="number"
            min={0}
            value={margins.top}
            onChange={(e) =>
              onMarginChange(
                "top",
                Number(e.target.value) || 0
              )
            }
            className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm outline-none focus:border-black"
          />
        </label>
        <label
          htmlFor={`margin-right-${page.id}`}
          className="flex items-center gap-2 font-whisper text-neutral-600 text-sm"
        >
          <RiLayoutRight2Line className="h-4 w-4 shrink-0" />
          <input
            id={`margin-right-${page.id}`}
            type="number"
            min={0}
            value={margins.right}
            onChange={(e) =>
              onMarginChange(
                "right",
                Number(e.target.value) || 0
              )
            }
            className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm outline-none focus:border-black"
          />
        </label>
        <label
          htmlFor={`margin-bottom-${page.id}`}
          className="flex items-center gap-2 font-whisper text-neutral-600 text-sm"
        >
          <RiLayoutBottom2Line className="h-4 w-4 shrink-0" />
          <input
            id={`margin-bottom-${page.id}`}
            type="number"
            min={0}
            value={margins.bottom}
            onChange={(e) =>
              onMarginChange(
                "bottom",
                Number(e.target.value) || 0
              )
            }
            className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm outline-none focus:border-black"
          />
        </label>
      </div>
    </ParameterBlock>
  );
}
