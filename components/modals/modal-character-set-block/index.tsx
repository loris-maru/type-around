"use client";

import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import ColorPicker from "@/components/molecules/color-picker";
import { useModalOpen } from "@/hooks/use-modal-open";
import type { CharacterSetBlockData } from "@/types/layout-typeface";

type CharacterSetBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CharacterSetBlockData) => void;
  initialData?: CharacterSetBlockData;
};

export default function CharacterSetBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CharacterSetBlockModalProps) {
  useModalOpen(isOpen);

  const [sampleText, setSampleText] = useState(
    initialData?.sampleText ||
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  );
  const [backgroundColor, setBackgroundColor] = useState(
    initialData?.backgroundColor || ""
  );
  const [fontColor, setFontColor] = useState(
    initialData?.fontColor || ""
  );

  const handleSave = () => {
    onSave({ sampleText, backgroundColor, fontColor });
    onClose();
  };

  if (!isOpen) return null;

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
            Character Set Block
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
          <div>
            <label
              htmlFor="sample-text"
              className="mb-2 block font-semibold text-black text-sm"
            >
              Sample text
            </label>
            <textarea
              value={sampleText}
              onChange={(e) =>
                setSampleText(e.target.value)
              }
              placeholder="Characters to display"
              rows={3}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 font-whisper text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="mb-1 block font-semibold text-black text-sm">
                Background color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="cs-bg-color"
                  value={backgroundColor || "#ffffff"}
                  onChange={setBackgroundColor}
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) =>
                    setBackgroundColor(e.target.value)
                  }
                  placeholder="#ffffff"
                  className="w-20 rounded-lg border border-neutral-300 px-2 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <div>
              <span className="mb-1 block font-semibold text-black text-sm">
                Font color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="cs-font-color"
                  value={fontColor || "#000000"}
                  onChange={setFontColor}
                />
                <input
                  type="text"
                  value={fontColor}
                  onChange={(e) =>
                    setFontColor(e.target.value)
                  }
                  placeholder="#000000"
                  className="w-20 rounded-lg border border-neutral-300 px-2 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-lg bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800"
            >
              Save Character Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
