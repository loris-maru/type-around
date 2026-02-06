"use client";

import { RiAddFill } from "react-icons/ri";
import CollapsibleSection from "@/components/global/collapsible-section";
import { FontCard } from "@/components/molecules/cards/account";
import { FontsListSectionProps } from "@/types/components";

export default function FontsListSection({
  fonts,
  onRemoveFont,
  onEditFont,
  onAddFontClick,
}: FontsListSectionProps) {
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
          className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-black hover:bg-neutral-50 transition-all duration-300 ease-in-out min-h-[140px]"
        >
          <RiAddFill className="w-8 h-8 text-neutral-400" />
          <span className="text-neutral-500 font-medium">
            Add Font
          </span>
        </button>
      </div>
    </CollapsibleSection>
  );
}
