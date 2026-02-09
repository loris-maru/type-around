"use client";

import Image from "next/image";
import {
  RiDeleteBinLine,
  RiImageLine,
} from "react-icons/ri";
import type { FontInUseCardProps } from "@/types/components";

// Check if URL is valid for display (not a blob URL)
const isValidImageUrl = (url: string) => {
  if (!url) return false;
  // Blob URLs don't persist and will fail
  if (url.startsWith("blob:")) return false;
  return true;
};

export default function FontInUseCard({
  fontInUse,
  onRemove,
  onEdit,
}: FontInUseCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    onEdit(fontInUse);
  };

  // Get first valid image
  const firstValidImage =
    fontInUse.images.find(isValidImageUrl);
  const validImagesCount =
    fontInUse.images.filter(isValidImageUrl).length;

  return (
    // biome-ignore lint/a11y/useSemanticElements: div required because card contains nested interactive elements (delete button)
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit(fontInUse);
        }
      }}
      className="relative flex cursor-pointer flex-col rounded-lg border border-black bg-white p-4 shadow-button transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-button-hover"
    >
      {/* Thumbnail */}
      <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-md bg-neutral-100">
        {firstValidImage ? (
          <>
            <Image
              width={800}
              height={800}
              src={firstValidImage}
              alt={fontInUse.projectName}
              fill
              className="object-cover"
              unoptimized={
                firstValidImage.startsWith("data:") ||
                firstValidImage.includes("firebasestorage")
              }
            />
            {validImagesCount > 1 && (
              <div className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-1 text-white text-xs">
                +{validImagesCount - 1}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <RiImageLine className="h-10 w-10 text-neutral-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="mb-1 font-bold font-ortank text-lg">
          {fontInUse.projectName}
        </div>
        <div className="mb-1 text-neutral-600 text-sm">
          by {fontInUse.designerName}
        </div>
        <div className="text-neutral-500 text-sm">
          {fontInUse.typefaceName}
        </div>
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(fontInUse.id);
        }}
        className="absolute top-2 right-2 p-2 text-neutral-400 transition-colors hover:text-red-500"
        title="Remove"
      >
        <RiDeleteBinLine className="h-5 w-5" />
      </button>
    </div>
  );
}
