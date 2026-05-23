"use client";

import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { ButtonModalSave } from "@/components/molecules/buttons";
import BlockBackgroundColorField from "@/components/molecules/block-background-color-field";
import ColorPicker from "@/components/molecules/color-picker";
import { useModalOpen } from "@/hooks/use-modal-open";
import type { SocialsBlockModalProps } from "@/types/components";
import { getInitialBlockBackgroundColor } from "@/utils/block-background-color";
import { handleHexChange } from "@/utils/color-utils";

export default function SocialsBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: SocialsBlockModalProps) {
  useModalOpen(isOpen);

  if (!isOpen) return null;

  return (
    <SocialsBlockModalInner
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
    />
  );
}

function SocialsBlockModalInner({
  onClose,
  onSave,
  initialData,
}: Omit<SocialsBlockModalProps, "isOpen">) {
  const [backgroundColor, setBackgroundColor] = useState(
    () =>
      getInitialBlockBackgroundColor(
        initialData?.backgroundColor
      )
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
      className="fixed inset-0 z-modal flex items-center justify-center overflow-hidden"
      data-modal
      data-lenis-prevent
    >
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 cursor-default bg-black/50"
        onClick={onClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white">
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            Socials Block
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
            Social links are loaded from your studio Account
            settings. Customize section colors here.
          </p>

          <div className="flex flex-wrap gap-6">
            <BlockBackgroundColorField
              id="socials-bg-color"
              value={backgroundColor}
              onChange={setBackgroundColor}
              className="min-w-0 flex-1"
            />
            <div className="min-w-0 flex-1">
              <span className="mb-2 block font-semibold text-black text-sm">
                Text color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="socials-text-color"
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
              label="Save Socials Block"
              aria-label="Save socials block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
