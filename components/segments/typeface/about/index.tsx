import RichTextContent from "@/components/global/rich-text/rich-text-content";
import { ABOUT_BLOCK_MARGIN_PRESET_MAP } from "@/constant/ABOUT_BLOCK_MARGIN_PRESETS";
import type { AboutBlockData } from "@/types/layout-typeface";
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
}: {
  description: string;
  data?: AboutBlockData;
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
  if (backgroundColor)
    sectionStyle.backgroundColor = backgroundColor;
  if (marginValue) {
    sectionStyle.marginTop = marginValue;
    sectionStyle.marginRight = marginValue;
    sectionStyle.marginBottom = marginValue;
    sectionStyle.marginLeft = marginValue;
  }

  const hasMarginOverride = !!marginValue;

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
      <h2 className="mb-4 font-black font-ortank text-2xl text-black">
        About
      </h2>
      <RichTextContent
        content={description}
        className={cn(
          "hyphens-auto font-whisper leading-relaxed",
          TEXT_SIZE_CLASSES[textSize],
          TEXT_ALIGN_CLASSES[textAlign],
          !textColor && "text-neutral-700"
        )}
        style={textColor ? { color: textColor } : undefined}
      />
    </section>
  );
}
