"use client";

import { useCallback, useMemo } from "react";
import FileDropZone from "@/components/global/file-drop-zone";
import { InputDropdown } from "@/components/global/inputs";
import ColorPicker from "@/components/molecules/color-picker";
import { SPECIMEN_BACKGROUND_TYPE_OPTIONS } from "@/constant/SPECIMEN_OPTIONS";
import type { PageBackgroundBlockProps } from "@/types/components";
import { handleHexChange } from "@/utils/color-utils";

const DEFAULT_BACKGROUND = {
  type: "color" as const,
  color: "#ffffff",
};

export default function PageBackgroundBlock({
  value,
  onChange,
  studioId,
}: PageBackgroundBlockProps) {
  const background = useMemo(
    () => value ?? DEFAULT_BACKGROUND,
    [value]
  );

  const handleTypeChange = useCallback(
    (typeValue: string) => {
      onChange({
        ...background,
        type: typeValue as "color" | "gradient" | "image",
      });
    },
    [background, onChange]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      onChange({ ...background, color });
    },
    [background, onChange]
  );

  const handleGradientFromChange = useCallback(
    (from: string) => {
      onChange({
        ...background,
        gradient: {
          from,
          to: background.gradient?.to ?? "#F2F2F2",
        },
      });
    },
    [background, onChange]
  );

  const handleGradientToChange = useCallback(
    (to: string) => {
      onChange({
        ...background,
        gradient: {
          from: background.gradient?.from ?? "#FFF8E8",
          to,
        },
      });
    },
    [background, onChange]
  );

  const handleImageChange = useCallback(
    (image: string) => {
      onChange({ ...background, image });
    },
    [background, onChange]
  );

  return (
    <div className="mb-8 grid grid-cols-2 gap-4">
      <div>
        <h3 className="mb-2 font-bold font-ortank text-base">
          Page background
        </h3>
        <InputDropdown
          value={background.type}
          options={SPECIMEN_BACKGROUND_TYPE_OPTIONS}
          onChange={handleTypeChange}
          className="w-full"
          transparent
        />
      </div>
      <div className="flex flex-col justify-center">
        {background.type === "color" && (
          <div className="flex items-center gap-2">
            <ColorPicker
              id="page-bg-color"
              value={background.color ?? "#ffffff"}
              onChange={handleColorChange}
            />
            <input
              type="text"
              value={background.color ?? "#ffffff"}
              onChange={(e) =>
                handleHexChange(
                  e.target.value,
                  handleColorChange
                )
              }
              maxLength={7}
              className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm uppercase outline-none focus:border-black"
              placeholder="#ffffff"
            />
          </div>
        )}

        {background.type === "gradient" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="font-whisper text-neutral-600 text-sm">
                From
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="page-bg-gradient-from"
                  value={
                    background.gradient?.from ?? "#FFF8E8"
                  }
                  onChange={handleGradientFromChange}
                />
                <input
                  type="text"
                  value={
                    background.gradient?.from ?? "#FFF8E8"
                  }
                  onChange={(e) =>
                    handleHexChange(
                      e.target.value,
                      handleGradientFromChange
                    )
                  }
                  maxLength={7}
                  className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm uppercase outline-none focus:border-black"
                  placeholder="#FFF8E8"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-whisper text-neutral-600 text-sm">
                To
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="page-bg-gradient-to"
                  value={
                    background.gradient?.to ?? "#F2F2F2"
                  }
                  onChange={handleGradientToChange}
                />
                <input
                  type="text"
                  value={
                    background.gradient?.to ?? "#F2F2F2"
                  }
                  onChange={(e) =>
                    handleHexChange(
                      e.target.value,
                      handleGradientToChange
                    )
                  }
                  maxLength={7}
                  className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm uppercase outline-none focus:border-black"
                  placeholder="#F2F2F2"
                />
              </div>
            </div>
          </div>
        )}

        {background.type === "image" && (
          <FileDropZone
            label=""
            accept="image/*"
            value={background.image ?? ""}
            onChange={handleImageChange}
            description=".jpg, .png, .webp"
            studioId={studioId}
            folder="images"
            icon="image"
          />
        )}
      </div>
    </div>
  );
}
