"use client";

import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { ButtonModalSave } from "@/components/molecules/buttons";
import ColorPicker from "@/components/molecules/color-picker";
import { SPACER_SIZE_OPTIONS } from "@/constant/BLOCK_OPTIONS";
import { useModalOpen } from "@/hooks/use-modal-open";
import type { UpdatesBlockModalProps } from "@/types/components";
import type { BlockMarginSize } from "@/types/layout-typeface";
import { cn } from "@/utils/class-names";
import { handleHexChange } from "@/utils/color-utils";

export default function UpdatesBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: UpdatesBlockModalProps) {
  useModalOpen(isOpen);

  if (!isOpen) return null;

  return (
    <UpdatesBlockModalInner
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
    />
  );
}

function UpdatesBlockModalInner({
  onClose,
  onSave,
  initialData,
}: Omit<UpdatesBlockModalProps, "isOpen">) {
  const [backgroundColor, setBackgroundColor] = useState(
    initialData?.backgroundColor || "#ffffff"
  );
  const [textColor, setTextColor] = useState(
    initialData?.textColor || "#000000"
  );
  const [margin, setMargin] = useState<BlockMarginSize>(
    initialData?.margin || "m"
  );

  const handleSave = () => {
    onSave({
      backgroundColor: backgroundColor || undefined,
      textColor: textColor || undefined,
      margin,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center overflow-hidden"
      data-modal
      data-lenis-prevent
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white">
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            Updates Block
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

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-6">
          <p className="font-whisper text-neutral-600 text-sm">
            Customize the updates section appearance.
          </p>

          <div className="flex flex-wrap gap-6">
            <div className="min-w-0 flex-1">
              <span className="mb-2 block font-semibold text-black text-sm">
                Background color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="updates-bg-color"
                  value={backgroundColor || "#ffffff"}
                  onChange={setBackgroundColor}
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) =>
                    handleHexChange(
                      e.target.value,
                      setBackgroundColor
                    )
                  }
                  maxLength={7}
                  placeholder="#ffffff"
                  className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm uppercase"
                />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <span className="mb-2 block font-semibold text-black text-sm">
                Text color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="updates-text-color"
                  value={textColor || "#000000"}
                  onChange={setTextColor}
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) =>
                    handleHexChange(
                      e.target.value,
                      setTextColor
                    )
                  }
                  maxLength={7}
                  placeholder="#000000"
                  className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm uppercase"
                />
              </div>
            </div>
          </div>

          <div>
            <span className="mb-2 block font-semibold text-black text-sm">
              Margin
            </span>
            <div className="flex gap-2">
              {SPACER_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setMargin(opt.value as BlockMarginSize)
                  }
                  className={cn(
                    "flex min-w-0 flex-1 items-center justify-center rounded-lg border px-2 py-2 font-medium font-whisper text-sm transition-colors",
                    margin === opt.value
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <ButtonModalSave
              type="button"
              onClick={handleSave}
              label="Save Updates Block"
              aria-label="Save updates block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
