import RichTextContent from "@/components/global/rich-text/rich-text-content";
import { ABOUT_BLOCK_MARGIN_PRESET_MAP } from "@/constant/ABOUT_BLOCK_MARGIN_PRESETS";
import type { AboutBlockData } from "@/types/layout-typeface";
import { applyBlockBackgroundColor } from "@/utils/block-background-color";
import { cn } from "@/utils/class-names";

const TEXT_SIZE_CLASSES: Record<
  NonNullable<AboutBlockData["textSize"]>,
  string
> = {
  s: "text-[16px]",
  m: "text-[24px]",
  l: "text-[40px]",
  xl: "text-[64px]",
  "2xl": "text-[80px]",
};

const TEXT_ALIGN_CLASSES: Record<
  NonNullable<AboutBlockData["textAlign"]>,
  string
> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function TypefaceAbout({
  description,
  data,
  titleFontUrl,
  textFontUrl,
}: {
  description: string;
  data?: AboutBlockData;
  titleFontUrl?: string;
  textFontUrl?: string;
}) {
  if (!description?.trim()) return null;

  const textAlign = data?.textAlign || "left";
  const textSize = data?.textSize || "m";
  const textColor = data?.textColor;
  const backgroundColor = data?.backgroundColor;
  const marginPreset = data?.margin;
  const marginValue =
    marginPreset &&
    ABOUT_BLOCK_MARGIN_PRESET_MAP[marginPreset];

  const sectionStyle: React.CSSProperties = {};
  applyBlockBackgroundColor(sectionStyle, backgroundColor);
  if (marginValue) {
    sectionStyle.marginTop = marginValue;
    sectionStyle.marginRight = marginValue;
    sectionStyle.marginBottom = marginValue;
    sectionStyle.marginLeft = marginValue;
  }

  const hasMarginOverride = !!marginValue;

  const titleFontFamily = titleFontUrl || undefined;
  const textFontFamily = textFontUrl || undefined;

  return (
    <section
      className={cn(
        "relative flex w-full flex-col px-5 py-12 lg:px-24",
        !hasMarginOverride && "my-20"
      )}
      id="about"
      style={
        Object.keys(sectionStyle).length > 0
          ? sectionStyle
          : undefined
      }
    >
      {/* React 19 hoists <style href precedence> into <head> automatically. */}
      {titleFontFamily && (
        <style
          href={`typeface-title-font:${titleFontFamily}`}
          precedence="default"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: font-face injection
          dangerouslySetInnerHTML={{
            __html: `@font-face{font-family:'page-title-font';src:url('${titleFontFamily}');font-display:swap;}`,
          }}
        />
      )}
      {textFontFamily && (
        <style
          href={`typeface-text-font:${textFontFamily}`}
          precedence="default"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: font-face injection
          dangerouslySetInnerHTML={{
            __html: `@font-face{font-family:'page-text-font';src:url('${textFontFamily}');font-display:swap;}`,
          }}
        />
      )}
      <h2
        className={cn(
          "mb-4 font-black text-2xl text-black",
          !titleFontFamily && "font-ortank"
        )}
        style={
          titleFontFamily
            ? {
                fontFamily: "'page-title-font', sans-serif",
              }
            : undefined
        }
      >
        About
      </h2>
      <RichTextContent
        content={description}
        className={cn(
          "hyphens-auto leading-relaxed",
          !textFontFamily && "font-whisper",
          TEXT_SIZE_CLASSES[textSize],
          TEXT_ALIGN_CLASSES[textAlign],
          !textColor && "text-neutral-700"
        )}
        style={{
          ...(textFontFamily
            ? { fontFamily: "'page-text-font', sans-serif" }
            : {}),
          ...(textColor ? { color: textColor } : {}),
        }}
      />
    </section>
  );
}
