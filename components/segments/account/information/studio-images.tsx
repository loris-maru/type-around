"use client";

import Image from "next/image";
import { useState } from "react";
import FileDropZone from "@/components/global/file-drop-zone";
import InputDropdown from "@/components/global/inputs/input-dropdown";
import ColorPicker from "@/components/molecules/color-picker";
import { useStudio } from "@/hooks/use-studio";
import { handleHexChange } from "@/utils/color-utils";

const DEFAULT_GRADIENT_FROM = "#FFF8E8";
const DEFAULT_GRADIENT_TO = "#F2F2F2";

const THUMBNAIL_TYPE_OPTIONS = [
  { value: "image", label: "Image" },
  { value: "color", label: "Plain color" },
  { value: "gradient", label: "Linear gradient" },
];

type ThumbnailType = "image" | "color" | "gradient";

export default function StudioImages() {
  const { studio, updateInformation, isLoading } =
    useStudio();
  const [isSaving, setIsSaving] = useState(false);

  const thumbnailType: ThumbnailType =
    (studio?.thumbnailType as ThumbnailType) ?? "image";
  const thumbnailColor =
    studio?.thumbnailColor || "#000000";
  const gradientFrom =
    studio?.thumbnailGradient?.from ||
    DEFAULT_GRADIENT_FROM;
  const gradientTo =
    studio?.thumbnailGradient?.to || DEFAULT_GRADIENT_TO;

  const updateAndSave = async (
    data: Parameters<typeof updateInformation>[0]
  ) => {
    if (!studio) return;
    setIsSaving(true);
    try {
      await updateInformation(data);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTypeChange = (value: string) =>
    updateAndSave({
      thumbnailType: value as ThumbnailType,
    });

  const handleThumbnailChange = (value: string) =>
    updateAndSave({ thumbnail: value });

  const handleColorChange = (value: string) =>
    updateAndSave({ thumbnailColor: value });

  const handleGradientChange = (
    next: Partial<{ from: string; to: string }>
  ) =>
    updateAndSave({
      thumbnailGradient: {
        from: next.from ?? gradientFrom,
        to: next.to ?? gradientTo,
      },
    });

  const handleAvatarChange = (value: string) =>
    updateAndSave({ avatar: value });

  if (isLoading || !studio) {
    return (
      <div className="animate-pulse">
        <div className="mb-6 h-8 w-48 rounded bg-neutral-200" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-40 rounded bg-neutral-200" />
          <div className="h-40 rounded bg-neutral-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <h2 className="mb-6 font-bold font-ortank text-xl">
        Studio Images
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <span className="mb-2 block font-semibold text-black text-sm">
              Studio Thumbnail
            </span>
            <p className="mb-3 font-whisper text-neutral-500 text-xs">
              Choose how your studio thumbnail is displayed.
            </p>
            <InputDropdown
              value={thumbnailType}
              options={THUMBNAIL_TYPE_OPTIONS}
              onChange={handleTypeChange}
            />
          </div>

          <ThumbnailPreview
            type={thumbnailType}
            image={studio.thumbnail}
            color={thumbnailColor}
            gradientFrom={gradientFrom}
            gradientTo={gradientTo}
          />

          {thumbnailType === "image" && (
            <FileDropZone
              label=""
              accept=".png,.jpg,.jpeg,.webp"
              value={studio.thumbnail || ""}
              onChange={handleThumbnailChange}
              description="PNG, JPEG, or WebP. Used as your studio cover image on cards. Recommended: 1200 × 800 px for high quality on all screens."
              icon="image"
              studioId={studio.id}
              folder="images"
            />
          )}

          {thumbnailType === "color" && (
            <div>
              <span className="mb-2 block font-semibold text-black text-sm">
                Color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="studio-thumbnail-color"
                  value={thumbnailColor}
                  onChange={handleColorChange}
                />
                <input
                  type="text"
                  value={thumbnailColor}
                  onChange={(e) =>
                    handleHexChange(
                      e.target.value,
                      handleColorChange
                    )
                  }
                  maxLength={7}
                  placeholder="#000000"
                  className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm uppercase"
                />
              </div>
            </div>
          )}

          {thumbnailType === "gradient" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="mb-2 block font-semibold text-black text-sm">
                  From
                </span>
                <div className="flex items-center gap-2">
                  <ColorPicker
                    id="studio-thumbnail-gradient-from"
                    value={gradientFrom}
                    onChange={(from) =>
                      handleGradientChange({ from })
                    }
                  />
                  <input
                    type="text"
                    value={gradientFrom}
                    onChange={(e) =>
                      handleHexChange(
                        e.target.value,
                        (from) =>
                          handleGradientChange({ from })
                      )
                    }
                    maxLength={7}
                    placeholder="#FFF8E8"
                    className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm uppercase"
                  />
                </div>
              </div>
              <div>
                <span className="mb-2 block font-semibold text-black text-sm">
                  To
                </span>
                <div className="flex items-center gap-2">
                  <ColorPicker
                    id="studio-thumbnail-gradient-to"
                    value={gradientTo}
                    onChange={(to) =>
                      handleGradientChange({ to })
                    }
                  />
                  <input
                    type="text"
                    value={gradientTo}
                    onChange={(e) =>
                      handleHexChange(
                        e.target.value,
                        (to) => handleGradientChange({ to })
                      )
                    }
                    maxLength={7}
                    placeholder="#F2F2F2"
                    className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm uppercase"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <FileDropZone
          label="Studio Avatar"
          accept=".png,.jpg,.jpeg,.webp"
          value={studio.avatar || ""}
          onChange={handleAvatarChange}
          description="PNG, JPEG, or WebP. Used as your studio profile picture."
          icon="image"
          studioId={studio.id}
          folder="images"
        />
      </div>
      {isSaving && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <span className="text-neutral-500 text-sm">
            Saving...
          </span>
        </div>
      )}
    </div>
  );
}

function ThumbnailPreview({
  type,
  image,
  color,
  gradientFrom,
  gradientTo,
}: {
  type: ThumbnailType;
  image?: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}) {
  const style: React.CSSProperties =
    type === "color"
      ? { backgroundColor: color }
      : type === "gradient"
        ? {
            backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          }
        : {};

  return (
    <div
      className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
      style={style}
    >
      {type === "image" &&
        (image ? (
          <Image
            src={image}
            alt="Studio thumbnail"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-whisper text-neutral-400 text-xs">
              No image yet
            </span>
          </div>
        ))}
    </div>
  );
}
