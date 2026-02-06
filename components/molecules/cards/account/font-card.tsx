"use client";

import { RiDeleteBinLine } from "react-icons/ri";
import { FontCardProps } from "@/types/components";

export default function FontCard({
  font,
  onRemove,
  onEdit,
}: FontCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening edit modal when clicking the delete button
    if ((e.target as HTMLElement).closest("button")) return;
    onEdit(font);
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex items-center justify-between p-4 border border-black bg-white shadow-button transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-button-hover rounded-lg cursor-pointer"
    >
      <div>
        <div className="font-ortank text-xl font-bold mb-2">
          {font.styleName}
        </div>
        <div className="flex flex-col gap-y-1 text-sm text-black">
          <div>
            Weight: {font.weight} | Width: {font.width}
            {font.isItalic && " | Italic"}
          </div>
          <div>
            Print: ${font.printPrice} | Web: $
            {font.webPrice}
          </div>
        </div>

        {font.file && (
          <div className="text-sm text-neutral-500 mt-5">
            File: {font.file}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(font.id);
        }}
        className="absolute top-2 right-2 p-2 text-neutral-400 hover:text-red-500 transition-colors"
        title="Remove font"
      >
        <RiDeleteBinLine className="w-5 h-5" />
      </button>
    </div>
  );
}
