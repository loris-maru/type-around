"use client";

import { useState } from "react";
import ColorPicker from "@/components/molecules/color-picker";
import { handleHexChange } from "@/utils/color-utils";

export default function GradientColorInput() {
  const [color1, setColor1] = useState("#FFF8E8");
  const [color2, setColor2] = useState("#F2F2F2");

  return (
    <div className="relative w-full">
      <span className="mb-2 block font-normal font-whisper text-black text-sm">
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
                handleHexChange(e.target.value, setColor1)
              }
              maxLength={7}
              aria-label="Gradient color 1 hex value"
              className="w-24 border border-neutral-300 px-3 py-2 font-whisper text-sm uppercase"
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
                handleHexChange(e.target.value, setColor2)
              }
              maxLength={7}
              aria-label="Gradient color 2 hex value"
              className="w-24 border border-neutral-300 px-3 py-2 font-whisper text-sm uppercase"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        {/* Gradient preview */}
        <div
          className="h-auto min-h-12 flex-1 border border-neutral-200"
          style={{
            background: `linear-gradient(180deg, ${color1} 0%, ${color2} 100%)`,
          }}
        />
      </div>
    </div>
  );
}
