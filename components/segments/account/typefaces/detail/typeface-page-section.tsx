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
  typefaceHangeulName,
  typefaceFonts,
  studioTypefaces,
}: TypefacePageSectionProps) {
  return (
    <div className="flex flex-col">
      <CollapsibleSection
        title="Background"
        defaultOpen={false}
      >
        <div className="pb-4">
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
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Fonts"
        defaultOpen={false}
      >
        <div className="pb-4">
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
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Layout">
        <div className="pb-4">
          <TypefacePageLayoutBuilder
            key={typefaceId}
            value={typefacePageLayout}
            onChange={onLayoutChange}
            studioId={studioId}
            typefaceId={typefaceId}
            typefaceHangeulName={typefaceHangeulName}
            pageTitleFont={pageTitleFont}
            pageTextFont={pageTextFont}
            pageTitleFontSameAsText={
              pageTitleFontSameAsText
            }
            typefacePageBackground={typefacePageBackground}
            typefaceFonts={typefaceFonts}
            studioTypefaces={studioTypefaces}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
