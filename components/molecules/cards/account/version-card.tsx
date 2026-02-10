"use client";

import { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import type { VersionCardProps } from "@/types/components";

export default function VersionCard({
  version,
  canDelete,
  onRemove,
  onEdit,
}: VersionCardProps) {
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
    onRemove(version.id);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  useEffect(() => {
    if (!showConfirm) return;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [showConfirm]);

  return (
    <>
      <button
        type="button"
        onClick={() => onEdit(version)}
        className="relative flex h-[200px] w-full cursor-pointer flex-col items-start justify-between rounded-lg border border-black bg-white p-4 text-left shadow-button transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-button-hover"
      >
        <div>
          <div className="mb-1 font-bold font-ortank text-xl">
            Version {version.versionNumber}
          </div>
          {version.description && (
            <p className="line-clamp-2 font-normal font-whisper text-neutral-500 text-sm">
              {version.description}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-y-1 text-black text-sm">
          <div className="font-whisper">
            Glyphs: {version.glyphSetCurrent} /{" "}
            {version.glyphSetFinal}
          </div>
        </div>

        {canDelete && (
          /* biome-ignore lint/a11y/useSemanticElements: cannot nest <button> inside <button> */
          <span
            role="button"
            tabIndex={0}
            onClick={handleDeleteClick}
            onKeyDown={handleDeleteKeyDown}
            className="absolute top-2 right-2 p-2 text-neutral-400 transition-colors hover:text-red-500"
            title="Remove version"
            aria-label="Remove version"
          >
            <RiDeleteBinLine className="h-5 w-5" />
          </span>
        )}
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
          <div className="relative mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-2 font-bold font-ortank text-lg">
              Delete version
            </h3>
            <p className="mb-6 font-whisper text-neutral-600 text-sm">
              Are you sure you want to delete Version{" "}
              {version.versionNumber}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-neutral-300 px-4 py-2 font-medium font-whisper transition-colors hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium font-whisper text-white transition-colors hover:bg-red-700"
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
