"use client";

import InputMultiSelect from "@/components/global/inputs/input-multi-select";
import {
  TYPEFACE_VISION_CONTRAST,
  TYPEFACE_VISION_FRAME,
  TYPEFACE_VISION_PLAYFUL,
  TYPEFACE_VISION_SERIF,
  TYPEFACE_VISION_USAGE,
  TYPEFACE_VISION_WIDTH,
} from "@/constant/TYPEFACE_VISION";
import type { TypefaceVisionBlockProps } from "@/types/components";

function parseVisionValue(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function VisionMultiSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string[]) => void;
}) {
  const valueArray = parseVisionValue(value);
  const optionItems = options.map((opt) => ({
    value: opt,
    label: opt,
  }));

  return (
    <InputMultiSelect
      label={label}
      value={valueArray}
      options={optionItems}
      onChange={onChange}
      placeholder="Select…"
      showTags
    />
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
        <VisionMultiSelect
          label="Usage"
          value={usage}
          options={[...TYPEFACE_VISION_USAGE]}
          onChange={onUsageChange}
        />
        <VisionMultiSelect
          label="Contrast"
          value={contrast}
          options={[...TYPEFACE_VISION_CONTRAST]}
          onChange={onContrastChange}
        />
        <VisionMultiSelect
          label="Width"
          value={width}
          options={[...TYPEFACE_VISION_WIDTH]}
          onChange={onWidthChange}
        />
        <VisionMultiSelect
          label="Am I playful"
          value={playful}
          options={[...TYPEFACE_VISION_PLAYFUL]}
          onChange={onPlayfulChange}
        />
        <VisionMultiSelect
          label="Frame"
          value={frame}
          options={[...TYPEFACE_VISION_FRAME]}
          onChange={onFrameChange}
        />
        <VisionMultiSelect
          label="Serif"
          value={serif}
          options={[...TYPEFACE_VISION_SERIF]}
          onChange={onSerifChange}
        />
      </div>
    </div>
  );
}
