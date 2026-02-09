"use client";

import { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import ColorPicker from "@/components/molecules/color-picker";
import type { TypefaceListBlockModalProps } from "@/types/components";

export default function TypefaceListBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: TypefaceListBlockModalProps) {
  const [backgroundColor, setBackgroundColor] = useState(
    initialData?.backgroundColor || ""
  );
  const [fontColor, setFontColor] = useState(
    initialData?.fontColor || ""
  );

  const handleSave = () => {
    onSave({ backgroundColor, fontColor });
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

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white">
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            Typeface List Block
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-6">
          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="mb-1 block font-semibold text-black text-sm">
                Background color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="tf-bg-color"
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
                  aria-label="Typeface list background color hex value"
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
                  id="tf-font-color"
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
                  aria-label="Typeface list font color hex value"
                  className="w-20 rounded-lg border border-neutral-300 px-2 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full cursor-pointer rounded-lg bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800"
            >
              Save Typeface List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
