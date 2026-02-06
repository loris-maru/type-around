"use client";

import {
  RiDeleteBinLine,
  RiImageLine,
} from "react-icons/ri";
import Image from "next/image";
import { FontInUseCardProps } from "@/types/components";

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
    <div
      onClick={handleCardClick}
      className="relative flex flex-col p-4 border border-black bg-white shadow-button transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-button-hover rounded-lg cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video mb-3 rounded-md overflow-hidden bg-neutral-100">
        {firstValidImage ? (
          <>
            <Image
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
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                +{validImagesCount - 1}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <RiImageLine className="w-10 h-10 text-neutral-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="font-ortank text-lg font-bold mb-1">
          {fontInUse.projectName}
        </div>
        <div className="text-sm text-neutral-600 mb-1">
          by {fontInUse.designerName}
        </div>
        <div className="text-sm text-neutral-500">
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
        className="absolute top-2 right-2 p-2 text-neutral-400 hover:text-red-500 transition-colors"
        title="Remove"
      >
        <RiDeleteBinLine className="w-5 h-5" />
      </button>
    </div>
  );
}
