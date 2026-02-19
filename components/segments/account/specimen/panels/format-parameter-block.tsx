"use client";

import { RiFile2Fill, RiFile2Line } from "react-icons/ri";
import CustomSelect from "@/components/global/custom-select";
import type { FormatParameterBlockProps } from "@/types/specimen";
import { cn } from "@/utils/class-names";
import ParameterBlock from "./parameter-block";

const FORMAT_OPTIONS = [
  { value: "A4", label: "A4" },
  { value: "Letter", label: "Letter" },
];

export default function FormatParameterBlock({
  format,
  orientation,
  onFormatChange,
  onOrientationChange,
}: FormatParameterBlockProps) {
  return (
    <ParameterBlock
      title="Format"
      collapsible
      defaultExpanded
    >
      <div className="flex flex-col gap-2">
        <CustomSelect
          value={format}
          options={FORMAT_OPTIONS}
          onChange={onFormatChange}
        />
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <span className="shrink-0 font-whisper text-neutral-600 text-sm">
            Orientation
          </span>
          <div className="flex flex-row items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onOrientationChange("portrait")
              }
              aria-label="Portrait orientation"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                orientation === "portrait"
                  ? "border-black bg-neutral-100"
                  : "border-neutral-300 hover:border-neutral-400"
              )}
            >
              {orientation === "portrait" ? (
                <RiFile2Fill className="h-5 w-5 text-black" />
              ) : (
                <RiFile2Line className="h-5 w-5 text-black" />
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                onOrientationChange("landscape")
              }
              aria-label="Landscape orientation"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                orientation === "landscape"
                  ? "border-black bg-neutral-100"
                  : "border-neutral-300 hover:border-neutral-400"
              )}
            >
              {orientation === "landscape" ? (
                <RiFile2Fill className="h-5 w-5 rotate-90 text-black" />
              ) : (
                <RiFile2Line className="h-5 w-5 text-black" />
              )}
            </button>
          </div>
        </div>
      </div>
    </ParameterBlock>
  );
}
