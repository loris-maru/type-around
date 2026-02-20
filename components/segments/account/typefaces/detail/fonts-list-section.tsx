"use client";

import { RiAddFill } from "react-icons/ri";
import CollapsibleSection from "@/components/global/collapsible-section";
import { FontCard } from "@/components/molecules/cards";
import FontSelector from "@/components/segments/account/typefaces/font-selector";
import type { FontsListSectionProps } from "@/types/components";
import FontLineText from "./font-line-text";

export default function FontsListSection({
  fonts,
  displayFontId,
  onRemoveFont,
  onEditFont,
  onAddFontClick,
  onDisplayFontChange,
  fontLineText,
  onInputChange,
}: FontsListSectionProps) {
  const selectedFont =
    fonts.find((f) => f.id === displayFontId) ?? null;

  return (
    <CollapsibleSection
      id="fonts"
      title="Fonts"
      count={fonts.length}
      countLabel="styles"
    >
      <div className="grid grid-cols-4 gap-4">
        {fonts.map((font) => (
          <FontCard
            key={font.id}
            font={font}
            onRemove={onRemoveFont}
            onEdit={onEditFont}
          />
        ))}

        {/* Add Font Button - same size as FontCard */}
        <button
          type="button"
          onClick={onAddFontClick}
          className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 border-dashed p-4 transition-all duration-300 ease-in-out hover:border-black hover:bg-neutral-50"
        >
          <RiAddFill className="h-8 w-8 text-neutral-400" />
          <span className="font-medium text-neutral-500">
            Add Font
          </span>
        </button>
      </div>

      {/* Display font selector */}
      {fonts.length > 0 && (
        <div className="mt-8 flex flex-col gap-4 rounded-lg border border-neutral-300 p-8">
          <div className="text-black">
            <div className="font-bold font-ortank text-xl">
              Font line
            </div>
            <p className="font-whisper text-neutral-500 text-sm">
              Setup the font line that will serve as a
              presentation text for your typeface.
            </p>
          </div>
          <FontSelector
            fonts={fonts}
            displayFontId={displayFontId}
            onDisplayFontChange={onDisplayFontChange}
            selectedFont={selectedFont}
          />
          {/* Font line text */}
          <FontLineText
            fontLineText={fontLineText}
            onInputChange={onInputChange}
          />
        </div>
      )}
    </CollapsibleSection>
  );
}
