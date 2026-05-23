"use client";

import { useRef } from "react";
import ColorPicker from "@/components/molecules/color-picker";
import InputCheckbox from "@/components/global/inputs/input-checkbox";
import { BLOCK_BACKGROUND_TRANSPARENT } from "@/constant/BLOCK_BACKGROUND_TRANSPARENT";
import { isTransparentBlockBackground } from "@/utils/block-background-color";
import { handleHexChange } from "@/utils/color-utils";
import { cn } from "@/utils/class-names";

type BlockBackgroundColorFieldProps = {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  defaultHex?: string;
  className?: string;
  compact?: boolean;
};

export default function BlockBackgroundColorField({
  id,
  label = "Background color",
  value,
  onChange,
  defaultHex = "#ffffff",
  className,
  compact = false,
}: BlockBackgroundColorFieldProps) {
  const lastHexRef = useRef(
    isTransparentBlockBackground(value)
      ? defaultHex
      : value || defaultHex
  );

  const isTransparent = isTransparentBlockBackground(value);
  const pickerValue = isTransparent
    ? lastHexRef.current
    : value || defaultHex;

  const handleTransparentChange = (checked: boolean) => {
    if (checked) {
      if (!isTransparentBlockBackground(value)) {
        lastHexRef.current = value || defaultHex;
      }
      onChange(BLOCK_BACKGROUND_TRANSPARENT);
      return;
    }
    onChange(lastHexRef.current || defaultHex);
  };

  const handleHexValueChange = (hex: string) => {
    lastHexRef.current = hex;
    onChange(hex);
  };

  return (
    <div className={cn("min-w-0", className)}>
      <span
        className={cn(
          "mb-2 block font-semibold text-black text-sm",
          compact && "mb-1"
        )}
      >
        {label}
      </span>
      <div className="mb-3">
        <InputCheckbox
          id={`${id}-transparent`}
          label="Transparent background"
          checked={isTransparent}
          onChange={handleTransparentChange}
        />
      </div>
      <div
        className={cn(
          "flex items-center gap-2",
          isTransparent && "pointer-events-none opacity-40"
        )}
      >
        <ColorPicker
          id={id}
          value={pickerValue}
          onChange={handleHexValueChange}
        />
        <input
          type="text"
          value={isTransparent ? "" : value}
          onChange={(e) =>
            handleHexChange(
              e.target.value,
              handleHexValueChange
            )
          }
          maxLength={7}
          placeholder={defaultHex}
          disabled={isTransparent}
          className={cn(
            "min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm uppercase",
            compact && "w-20 flex-none px-2"
          )}
        />
      </div>
    </div>
  );
}
