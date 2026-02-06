"use client";

import { useState } from "react";
import { useStudio } from "@/hooks/use-studio";
import FileDropZone from "@/components/global/file-drop-zone";

export default function StudioImages() {
  const { studio, updateInformation, isLoading } =
    useStudio();
  const [isSaving, setIsSaving] = useState(false);

  const handleThumbnailChange = async (value: string) => {
    if (!studio) return;
    setIsSaving(true);
    try {
      await updateInformation({ thumbnail: value });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (value: string) => {
    if (!studio) return;
    setIsSaving(true);
    try {
      await updateInformation({ avatar: value });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !studio) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-neutral-200 rounded mb-6" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-40 bg-neutral-200 rounded" />
          <div className="h-40 bg-neutral-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <h2 className="text-xl font-ortank font-bold mb-6">
        Studio Images
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <FileDropZone
          label="Studio Thumbnail"
          accept=".png,.jpg,.jpeg,.webp"
          value={studio.thumbnail || ""}
          onChange={handleThumbnailChange}
          description="PNG, JPEG, or WebP. Used as your studio cover image."
          icon="image"
          studioId={studio.id}
          folder="images"
        />
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
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <span className="text-sm text-neutral-500">
            Saving...
          </span>
        </div>
      )}
    </div>
  );
}
