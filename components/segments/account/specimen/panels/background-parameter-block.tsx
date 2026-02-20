"use client";

import { useCallback } from "react";
import CustomSelect from "@/components/global/custom-select";
import FileDropZone from "@/components/global/file-drop-zone";
import ColorPicker from "@/components/molecules/color-picker";
import { SPECIMEN_BACKGROUND_TYPE_OPTIONS } from "@/constant/SPECIMEN_OPTIONS";
import type { BackgroundParameterBlockProps } from "@/types/specimen";
import ParameterBlock from "./parameter-block";
import { handleHexChange } from "@/utils/color-utils";
import { getPageBackground } from "@/utils/specimen-utils";

export default function BackgroundParameterBlock({
  page,
  studioId,
  onChange,
  expanded,
  onToggle,
}: BackgroundParameterBlockProps) {
  const background = getPageBackground(page);

  const handleTypeChange = useCallback(
    (value: string) => {
      onChange({
        ...background,
        type: value as "color" | "gradient" | "image",
      });
    },
    [background, onChange]
  );

  const handleColorChange = useCallback(
    (value: string) => {
      onChange({ ...background, color: value });
    },
    [background, onChange]
  );

  const handleGradientFromChange = useCallback(
    (value: string) => {
      onChange({
        ...background,
        gradient: {
          from: value,
          to: background.gradient?.to ?? "#F2F2F2",
        },
      });
    },
    [background, onChange]
  );

  const handleGradientToChange = useCallback(
    (value: string) => {
      onChange({
        ...background,
        gradient: {
          from: background.gradient?.from ?? "#FFF8E8",
          to: value,
        },
      });
    },
    [background, onChange]
  );

  const handleImageChange = useCallback(
    (value: string) => {
      onChange({ ...background, image: value });
    },
    [background, onChange]
  );

  return (
    <ParameterBlock
      title="Background"
      collapsible
      defaultExpanded
      expanded={expanded}
      onToggle={onToggle}
    >
      <div className="flex flex-col gap-3">
        <CustomSelect
          value={background.type}
          options={SPECIMEN_BACKGROUND_TYPE_OPTIONS}
          onChange={handleTypeChange}
        />

        {background.type === "color" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ColorPicker
                id={`bg-color-${page.id}`}
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
                  id={`bg-gradient-from-${page.id}`}
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
                  id={`bg-gradient-to-${page.id}`}
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
    </ParameterBlock>
  );
}
