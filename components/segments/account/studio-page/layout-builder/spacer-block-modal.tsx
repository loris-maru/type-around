"use client";

import { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { SPACER_SIZE_OPTIONS } from "@/constant/BLOCK_OPTIONS";
import type { SpacerBlockModalProps } from "@/types/components";
import type { SpacerSize } from "@/types/layout";
import { cn } from "@/utils/class-names";

export default function SpacerBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: SpacerBlockModalProps) {
  const [size, setSize] = useState<SpacerSize>(
    initialData?.size || "m"
  );

  const handleSave = () => {
    onSave({ size });
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-sm flex-col rounded-lg bg-white">
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            Spacer Block
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1 transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-6">
          {/* Size */}
          <div>
            <span className="mb-2 block font-semibold text-black text-sm">
              Size
            </span>
            <div className="flex gap-2">
              {SPACER_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSize(opt.value)}
                  className={cn(
                    "flex-1 cursor-pointer rounded-lg border py-2 font-medium font-whisper text-sm transition-colors",
                    size === opt.value
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full cursor-pointer rounded-lg bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800"
            >
              Save Spacer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
