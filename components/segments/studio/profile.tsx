"use client";

import { useStudioFonts } from "@/contexts/studio-fonts-context";
import type { Designer } from "@/types/studio";
import StudioAboutDesignerProfilesBlock from "../studio-page-blocks/about-designer-profiles";
import StudioAboutStoryBlock from "../studio-page-blocks/about-story";

export default function StudioProfile({
  name,
  image,
  description,
  designers = [],
  sectionStyle,
  textSizeClass,
  textAlignClass,
}: {
  name: string;
  image: string;
  description: string;
  designers?: Designer[];
  sectionStyle?: React.CSSProperties;
  marginValue?: string;
  textSizeClass?: string;
  textAlignClass?: string;
  defaultMargin?: boolean;
}) {
  const { textFontFamily } = useStudioFonts();

  const designersList: Designer[] = (() => {
    const d = designers ?? [];
    return Array.isArray(d)
      ? d.filter(
          (x): x is Designer =>
            x != null && typeof x === "object"
        )
      : [];
  })();

  const designerTextClass =
    "text-3xl uppercase tracking-wider leading-none text-black";

  return (
    <section
      className="relative w-full"
      id="about"
      style={sectionStyle}
    >
      {/* ── Two equal columns ── */}
      <StudioAboutStoryBlock
        image={image}
        description={description}
        textFontFamily={textFontFamily}
        textSizeClass={textSizeClass}
        textAlignClass={textAlignClass}
        name={name}
      />

      {/* ── Designers section ── */}
      {designersList.length > 0 && (
        <StudioAboutDesignerProfilesBlock
          designersList={designersList}
          textFontFamily={textFontFamily}
          designerTextClass={designerTextClass}
        />
      )}
    </section>
  );
}
