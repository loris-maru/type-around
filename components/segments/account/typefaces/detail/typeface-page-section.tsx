"use client";

import CollapsibleSection from "@/components/global/collapsible-section";
import type { TypefaceLayoutItem } from "@/types/layout-typeface";
import TypefacePageLayoutBuilder from "./typeface-page/typeface-page-layout-builder";

type TypefacePageSectionProps = {
  typefacePageLayout: TypefaceLayoutItem[];
  onLayoutChange: (layout: TypefaceLayoutItem[]) => void;
  studioId: string;
  typefaceId: string;
};

export default function TypefacePageSection({
  typefacePageLayout,
  onLayoutChange,
  studioId,
  typefaceId,
}: TypefacePageSectionProps) {
  return (
    <CollapsibleSection
      id="typeface-page"
      title="Typeface page"
    >
      <div className="mt-4">
        <TypefacePageLayoutBuilder
          key={typefaceId}
          value={typefacePageLayout}
          onChange={onLayoutChange}
          studioId={studioId}
          typefaceId={typefaceId}
        />
      </div>
    </CollapsibleSection>
  );
}
