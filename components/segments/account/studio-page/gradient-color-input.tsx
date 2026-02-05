"use client";

import { useState, ChangeEvent } from "react";

export default function GradientColorInput() {
  const [color1, setColor1] = useState("#FFF8E8");
  const [color2, setColor2] = useState("#F2F2F2");

  const handleColorChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    setter(e.target.value);
  };

  const handleHexChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    let value = e.target.value;

    // Add # if not present
    if (!value.startsWith("#")) {
      value = "#" + value;
    }

    // Only update if it's a valid hex format (partial or complete)
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="relative w-full">
      <label className="text-base font-normal text-neutral-500 mb-2 block">
        Gradient Color
      </label>

      <div className="flex items-stretch gap-4">
        {/* Color inputs column */}
        <div className="flex flex-col gap-3">
          {/* Color 1 */}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color1}
              onChange={(e) =>
                handleColorChange(e, setColor1)
              }
              className="w-8 h-8 border-0 cursor-pointer rounded overflow-hidden"
              style={{ padding: 0 }}
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
            <input
              type="color"
              value={color2}
              onChange={(e) =>
                handleColorChange(e, setColor2)
              }
              className="w-8 h-8 border-0 cursor-pointer rounded overflow-hidden"
              style={{ padding: 0 }}
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
