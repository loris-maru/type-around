"use client";

import { InputDropdown } from "@/components/global/inputs";
import {
  TYPEFACE_VISION_CONTRAST,
  TYPEFACE_VISION_FRAME,
  TYPEFACE_VISION_PLAYFUL,
  TYPEFACE_VISION_SERIF,
  TYPEFACE_VISION_USAGE,
  TYPEFACE_VISION_WIDTH,
} from "@/constant/TYPEFACE_VISION";

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
      <InputDropdown
        value={value}
        options={[
          { value: "", label: "Select…" },
          ...options.map((opt) => ({
            value: opt,
            label: opt,
          })),
        ]}
        onChange={onChange}
        className="w-full"
      />
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
