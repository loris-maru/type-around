import { useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import type { Font } from "@/types/studio";

export default function FontSelector({
  fonts,
  displayFontId,
  onDisplayFontChange,
  selectedFont,
}: {
  fonts: Font[];
  displayFontId: string;
  onDisplayFontChange: (fontId: string) => void;
  selectedFont: Font | null;
}) {
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <span className="mb-2 block font-semibold font-whisper text-black text-sm">
        Displayed font
      </span>
      <div
        ref={dropdownRef}
        className="relative"
      >
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-neutral-300 bg-white px-4 py-3 font-whisper text-sm transition-colors hover:border-neutral-400"
        >
          <span
            className={
              selectedFont
                ? "text-black"
                : "text-neutral-500"
            }
          >
            {selectedFont
              ? `${selectedFont.styleName} (w${selectedFont.weight})`
              : "Select a font..."}
          </span>
          <RiArrowDropDownLine
            className={`h-5 w-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
            {fonts
              .filter((f) => f.file)
              .map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => {
                    onDisplayFontChange(font.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full cursor-pointer px-4 py-2.5 text-left font-whisper text-sm transition-colors ${
                    font.id === displayFontId
                      ? "bg-neutral-100 font-medium text-black"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {font.styleName} (w{font.weight})
                </button>
              ))}
            {fonts.filter((f) => f.file).length === 0 && (
              <p className="px-4 py-2.5 font-whisper text-neutral-400 text-sm">
                No fonts with uploaded files yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
