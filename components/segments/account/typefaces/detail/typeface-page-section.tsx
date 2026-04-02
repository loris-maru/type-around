"use client";

import CollapsibleSection from "@/components/global/collapsible-section";
import type { TypefacePageSectionProps } from "@/types/components";
import PageBackgroundBlock from "./typeface-page/page-background-block";
import PageFontsBlock from "./typeface-page/page-fonts-block";
import TypefacePageLayoutBuilder from "./typeface-page/typeface-page-layout-builder";

export default function TypefacePageSection({
  typefacePageLayout,
  onLayoutChange,
  typefacePageBackground,
  onPageBackgroundChange,
  pageTitleFont,
  pageTextFont,
  pageTitleFontSameAsText,
  pageTextFontSameAsTitle,
  onPageTitleFontChange,
  onPageTextFontChange,
  onPageTitleFontSameAsTextChange,
  onPageTextFontSameAsTitleChange,
  studioId,
  typefaceId,
  typefaceFonts,
  studioTypefaces,
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
        <PageFontsBlock
          titleFont={pageTitleFont}
          textFont={pageTextFont}
          titleFontSameAsText={pageTitleFontSameAsText}
          textFontSameAsTitle={pageTextFontSameAsTitle}
          onTitleFontChange={onPageTitleFontChange}
          onTextFontChange={onPageTextFontChange}
          onTitleFontSameAsTextChange={
            onPageTitleFontSameAsTextChange
          }
          onTextFontSameAsTitleChange={
            onPageTextFontSameAsTitleChange
          }
          studioId={studioId}
        />
        <TypefacePageLayoutBuilder
          key={typefaceId}
          value={typefacePageLayout}
          onChange={onLayoutChange}
          studioId={studioId}
          typefaceId={typefaceId}
          typefaceFonts={typefaceFonts}
          studioTypefaces={studioTypefaces}
        />
      </div>
    </CollapsibleSection>
  );
}
