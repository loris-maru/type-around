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

      <div className="relative bg-white rounded-lg w-full max-w-sm mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 shrink-0">
          <h2 className="font-ortank text-xl font-bold">
            Spacer Block
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 min-h-0 p-6 space-y-5 overflow-y-auto overscroll-contain">
          {/* Size */}
          <div>
            <span className="block text-sm font-semibold text-black mb-2">
              Size
            </span>
            <div className="flex gap-2">
              {SPACER_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSize(opt.value)}
                  className={cn(
                    "flex-1 py-2 text-sm font-whisper font-medium rounded-lg border transition-colors cursor-pointer",
                    size === opt.value
                      ? "bg-black text-white border-black"
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
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
              className="w-full py-3 bg-black text-white font-whisper font-medium rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Save Spacer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
