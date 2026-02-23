"use client";

import CollapsibleSection from "@/components/global/collapsible-section";
import type { TypefacePageSectionProps } from "@/types/components";
import PageBackgroundBlock from "./typeface-page/page-background-block";
import TypefacePageLayoutBuilder from "./typeface-page/typeface-page-layout-builder";

export default function TypefacePageSection({
  typefacePageLayout,
  onLayoutChange,
  typefacePageBackground,
  onPageBackgroundChange,
  studioId,
  typefaceId,
}: TypefacePageSectionProps) {
  return (
    <CollapsibleSection title="Typeface page">
      <div className="mt-4">
        <PageBackgroundBlock
          value={
            typefacePageBackground ?? {
              type: "color",
              color: "#ffffff",
              image: "",
            }
          }
          onChange={onPageBackgroundChange}
          studioId={studioId}
        />
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
