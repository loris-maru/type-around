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

      <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 shrink-0">
          <h2 className="font-ortank text-xl font-bold">
            Typeface List Block
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 min-h-0 p-6 space-y-5 overflow-y-auto overscroll-contain">
          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-sm font-semibold text-black mb-1">
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
                  className="w-20 px-2 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <span className="block text-sm font-semibold text-black mb-1">
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
                  className="w-20 px-2 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3 bg-black text-white font-whisper font-medium rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Save Typeface List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
