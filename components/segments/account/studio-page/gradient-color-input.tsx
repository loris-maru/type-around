"use client";

import { useCallback } from "react";
import ColorPicker from "@/components/molecules/color-picker";
import { handleHexChange } from "@/utils/color-utils";

const DEFAULT_FROM = "#FFF8E8";
const DEFAULT_TO = "#F2F2F2";

function parseGradientValue(value: string | undefined): {
  from: string;
  to: string;
} {
  if (!value) return { from: DEFAULT_FROM, to: DEFAULT_TO };
  try {
    const parsed = JSON.parse(value) as {
      from?: string;
      to?: string;
    };
    return {
      from: parsed.from || DEFAULT_FROM,
      to: parsed.to || DEFAULT_TO,
    };
  } catch {
    return { from: DEFAULT_FROM, to: DEFAULT_TO };
  }
}

export default function GradientColorInput({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const { from: color1, to: color2 } =
    parseGradientValue(value);

  const notifyChange = useCallback(
    (from: string, to: string) => {
      onChange?.(
        JSON.stringify({
          from,
          to,
        })
      );
    },
    [onChange]
  );

  const handleColor1Change = useCallback(
    (newColor: string) => {
      notifyChange(newColor, color2);
    },
    [color2, notifyChange]
  );

  const handleColor2Change = useCallback(
    (newColor: string) => {
      notifyChange(color1, newColor);
    },
    [color1, notifyChange]
  );

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
              onChange={handleColor1Change}
            />
            <input
              type="text"
              value={color1}
              onChange={(e) =>
                handleHexChange(
                  e.target.value,
                  handleColor1Change
                )
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
              onChange={handleColor2Change}
            />
            <input
              type="text"
              value={color2}
              onChange={(e) =>
                handleHexChange(
                  e.target.value,
                  handleColor2Change
                )
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
