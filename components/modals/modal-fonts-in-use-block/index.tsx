"use client";

import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { ButtonModalSave } from "@/components/molecules/buttons";
import ColorPicker from "@/components/molecules/color-picker";
import { useModalOpen } from "@/hooks/use-modal-open";
import type { FontsInUseBlockModalProps } from "@/types/components";
import { handleHexChange } from "@/utils/color-utils";

export default function FontsInUseBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: FontsInUseBlockModalProps) {
  useModalOpen(isOpen);

  if (!isOpen) return null;

  return (
    <FontsInUseBlockModalInner
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
    />
  );
}

function FontsInUseBlockModalInner({
  onClose,
  onSave,
  initialData,
}: Omit<FontsInUseBlockModalProps, "isOpen">) {
  const [backgroundColor, setBackgroundColor] = useState(
    initialData?.backgroundColor || "#ffffff"
  );
  const [fontColor, setFontColor] = useState(
    initialData?.fontColor || "#000000"
  );

  const handleSave = () => {
    onSave({
      backgroundColor: backgroundColor || undefined,
      fontColor: fontColor || undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden"
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
            Fonts in Use Block
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
            Customize the fonts in use section appearance.
          </p>

          <div className="flex flex-wrap gap-6">
            <div className="min-w-0 flex-1">
              <span className="mb-2 block font-semibold text-black text-sm">
                Background color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="fiu-bg-color"
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
                  id="fiu-text-color"
                  value={fontColor || "#000000"}
                  onChange={setFontColor}
                />
                <input
                  type="text"
                  value={fontColor}
                  onChange={(e) =>
                    handleHexChange(
                      e.target.value,
                      setFontColor
                    )
                  }
                  maxLength={7}
                  placeholder="#000000"
                  className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm uppercase"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <ButtonModalSave
              type="button"
              onClick={handleSave}
              label="Save Fonts in Use Block"
              aria-label="Save fonts in use block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
