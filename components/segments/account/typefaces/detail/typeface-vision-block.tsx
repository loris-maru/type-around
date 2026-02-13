"use client";

import { RiArrowDropDownLine } from "react-icons/ri";
import {
  TYPEFACE_VISION_CONTRAST,
  TYPEFACE_VISION_FRAME,
  TYPEFACE_VISION_PLAYFUL,
  TYPEFACE_VISION_SERIF,
  TYPEFACE_VISION_USAGE,
  TYPEFACE_VISION_WIDTH,
} from "@/constant/TYPEFACE_VISION";
import { cn } from "@/utils/class-names";

type TypefaceVisionBlockProps = {
  usage: string;
  contrast: string;
  width: string;
  playful: string;
  frame: string;
  serif: string;
  onUsageChange: (value: string) => void;
  onContrastChange: (value: string) => void;
  onWidthChange: (value: string) => void;
  onPlayfulChange: (value: string) => void;
  onFrameChange: (value: string) => void;
  onSerifChange: (value: string) => void;
};

function SelectDropdown({
  label,
  value,
  options,
  onChange,
  id,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  id: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-normal font-whisper text-black text-sm"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full cursor-pointer appearance-none rounded-lg border border-neutral-300 bg-white px-4 py-3 pr-10 font-whisper text-neutral-700 text-sm transition-colors focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          )}
          aria-label={label}
        >
          <option value="">Select…</option>
          {options.map((opt) => (
            <option
              key={opt}
              value={opt}
            >
              {opt}
            </option>
          ))}
        </select>
        <RiArrowDropDownLine
          size={20}
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400"
        />
      </div>
    </div>
  );
}

export default function TypefaceVisionBlock({
  usage,
  contrast,
  width,
  playful,
  frame,
  serif,
  onUsageChange,
  onContrastChange,
  onWidthChange,
  onPlayfulChange,
  onFrameChange,
  onSerifChange,
}: TypefaceVisionBlockProps) {
  return (
    <div className="rounded-lg border border-neutral-200 p-6">
      <span className="mb-4 block font-extrabold font-ortank text-black text-lg">
        Typeface vision
      </span>
      <div className="grid grid-cols-4 gap-4">
        <SelectDropdown
          id="vision-usage"
          label="Usage"
          value={usage}
          options={[...TYPEFACE_VISION_USAGE]}
          onChange={onUsageChange}
        />
        <SelectDropdown
          id="vision-contrast"
          label="Contrast"
          value={contrast}
          options={[...TYPEFACE_VISION_CONTRAST]}
          onChange={onContrastChange}
        />
        <SelectDropdown
          id="vision-width"
          label="Width"
          value={width}
          options={[...TYPEFACE_VISION_WIDTH]}
          onChange={onWidthChange}
        />
        <SelectDropdown
          id="vision-playful"
          label="Am I playful"
          value={playful}
          options={[...TYPEFACE_VISION_PLAYFUL]}
          onChange={onPlayfulChange}
        />
        <SelectDropdown
          id="vision-frame"
          label="Frame"
          value={frame}
          options={[...TYPEFACE_VISION_FRAME]}
          onChange={onFrameChange}
        />
        <SelectDropdown
          id="vision-serif"
          label="Serif"
          value={serif}
          options={[...TYPEFACE_VISION_SERIF]}
          onChange={onSerifChange}
        />
      </div>
    </div>
  );
}
