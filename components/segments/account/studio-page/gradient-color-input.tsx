"use client";

import { type ChangeEvent, useState } from "react";
import ColorPicker from "@/components/molecules/color-picker";

export default function GradientColorInput() {
  const [color1, setColor1] = useState("#FFF8E8");
  const [color2, setColor2] = useState("#F2F2F2");

  const handleHexChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    let value = e.target.value;

    // Add # if not present
    if (!value.startsWith("#")) {
      value = `#${value}`;
    }

    // Only update if it's a valid hex format (partial or complete)
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="relative w-full">
      <span className="block font-whisper text-sm font-normal text-black mb-2">
        Gradient Color
      </span>

      <div className="flex items-stretch gap-4">
        {/* Color inputs column */}
        <div className="flex flex-col gap-3">
          {/* Color 1 */}
          <div className="flex items-center gap-2">
            <ColorPicker
              id="gradient-color-1"
              value={color1}
              onChange={setColor1}
            />
            <input
              type="text"
              value={color1}
              onChange={(e) =>
                handleHexChange(e, setColor1)
              }
              maxLength={7}
              className="w-24 px-3 py-2 border border-neutral-300 font-whisper text-sm uppercase"
              placeholder="#000000"
            />
          </div>

          {/* Color 2 */}
          <div className="flex items-center gap-2">
            <ColorPicker
              id="gradient-color-2"
              value={color2}
              onChange={setColor2}
            />
            <input
              type="text"
              value={color2}
              onChange={(e) =>
                handleHexChange(e, setColor2)
              }
              maxLength={7}
              className="w-24 px-3 py-2 border border-neutral-300 font-whisper text-sm uppercase"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        {/* Gradient preview */}
        <div
          className="flex-1 h-auto min-h-12 border border-neutral-200"
          style={{
            background: `linear-gradient(180deg, ${color1} 0%, ${color2} 100%)`,
          }}
        />
      </div>
    </div>
  );
}
