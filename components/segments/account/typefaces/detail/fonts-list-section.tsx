"use client";

import { RiAddFill } from "react-icons/ri";
import CollapsibleSection from "@/components/global/collapsible-section";
import { FontCard } from "@/components/molecules/cards";
import type { FontsListSectionProps } from "@/types/components";

export default function FontsListSection({
  fonts,
  onRemoveFont,
  onEditFont,
  onAddFontClick,
}: FontsListSectionProps) {
  return (
    <CollapsibleSection
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
    </CollapsibleSection>
  );
}
