"use client";

import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { ButtonModalSave } from "@/components/molecules/buttons";
import ColorPicker from "@/components/molecules/color-picker";
import { useModalOpen } from "@/hooks/use-modal-open";
import type { DownloadBlockModalProps } from "@/types/components";
import { handleHexChange } from "@/utils/color-utils";

export default function DownloadBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: DownloadBlockModalProps) {
  useModalOpen(isOpen);

  if (!isOpen) return null;

  return (
    <DownloadBlockModalInner
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
    />
  );
}

function DownloadBlockModalInner({
  onClose,
  onSave,
  initialData,
}: Omit<DownloadBlockModalProps, "isOpen">) {
  const [showTrialFonts, setShowTrialFonts] = useState(
    initialData?.showTrialFonts ?? true
  );
  const [showSpecimen, setShowSpecimen] = useState(
    initialData?.showSpecimen ?? true
  );
  const [backgroundColor, setBackgroundColor] = useState(
    initialData?.backgroundColor || ""
  );

  const handleSave = () => {
    onSave({
      showTrialFonts,
      showSpecimen,
      backgroundColor: backgroundColor || undefined,
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
            Download Block
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
            Choose which download options to display.
          </p>

          <div className="flex flex-col gap-3">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={showTrialFonts}
                onChange={(e) =>
                  setShowTrialFonts(e.target.checked)
                }
                className="h-4 w-4 rounded border-neutral-300"
              />
              <span className="font-medium font-whisper text-sm">
                Trial fonts
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={showSpecimen}
                onChange={(e) =>
                  setShowSpecimen(e.target.checked)
                }
                className="h-4 w-4 rounded border-neutral-300"
              />
              <span className="font-medium font-whisper text-sm">
                Specimen
              </span>
            </label>
          </div>

          <div>
            <span className="mb-2 block font-semibold text-black text-sm">
              Background color
            </span>
            <div className="flex items-center gap-2">
              <ColorPicker
                id="download-bg-color"
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

          <div className="pt-2">
            <ButtonModalSave
              type="button"
              onClick={handleSave}
              label="Save Download Block"
              aria-label="Save download block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
