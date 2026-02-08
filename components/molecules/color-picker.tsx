"use client";

import { useRef } from "react";
import type { ColorPickerProps } from "@/types/components";

export default function ColorPicker({
  id,
  value,
  onChange,
}: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayColor = value || "#ffffff";

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(e.target.value);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-8 h-8 rounded-full border border-neutral-300 cursor-pointer shrink-0 overflow-hidden p-0 relative"
      aria-label="Pick a color"
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: displayColor }}
      />
      <input
        ref={inputRef}
        type="color"
        id={id}
        value={displayColor}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        tabIndex={-1}
      />
    </button>
  );
}
