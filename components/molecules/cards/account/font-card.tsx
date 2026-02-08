"use client";

import { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import type { FontCardProps } from "@/types/components";

export default function FontCard({
  font,
  onRemove,
  onEdit,
}: FontCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleDeleteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.stopPropagation();
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    onRemove(font.id);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  useEffect(() => {
    if (!showConfirm) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showConfirm]);

  return (
    <>
      <button
        type="button"
        onClick={() => onEdit(font)}
        className="relative flex flex-col items-start h-[200px] justify-between p-4 border border-black bg-white shadow-button transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-button-hover rounded-lg cursor-pointer text-left w-full"
      >
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

        {/* biome-ignore lint/a11y/useSemanticElements: cannot nest <button> inside <button> */}
        <span
          role="button"
          tabIndex={0}
          onClick={handleDeleteClick}
          onKeyDown={handleDeleteKeyDown}
          className="absolute top-2 right-2 p-2 text-neutral-400 hover:text-red-500 transition-colors"
          title="Remove font"
        >
          <RiDeleteBinLine className="w-5 h-5" />
        </span>
      </button>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click to dismiss */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop click to dismiss */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCancel}
          />
          <div className="relative bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="font-ortank text-lg font-bold mb-2">
              Delete font
            </h3>
            <p className="text-sm font-whisper text-neutral-600 mb-6">
              Are you sure you want to delete this font?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-neutral-300 rounded-lg font-whisper font-medium hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-whisper font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
