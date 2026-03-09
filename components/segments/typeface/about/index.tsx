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
  const marginTop = data?.marginTop;
  const marginRight = data?.marginRight;
  const marginBottom = data?.marginBottom;
  const marginLeft = data?.marginLeft;

  const sectionStyle: React.CSSProperties = {};
  if (backgroundColor)
    sectionStyle.backgroundColor = backgroundColor;
  if (marginTop) sectionStyle.marginTop = marginTop;
  if (marginRight) sectionStyle.marginRight = marginRight;
  if (marginBottom)
    sectionStyle.marginBottom = marginBottom;
  if (marginLeft) sectionStyle.marginLeft = marginLeft;

  const hasMarginOverride =
    marginTop || marginRight || marginBottom || marginLeft;

  return (
    <section
      className={cn(
        "relative flex w-full flex-col px-5 lg:px-24",
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
      <p
        className={cn(
          "hyphens-auto font-whisper leading-relaxed",
          TEXT_SIZE_CLASSES[textSize],
          TEXT_ALIGN_CLASSES[textAlign],
          !textColor && "text-neutral-700"
        )}
        style={textColor ? { color: textColor } : undefined}
      >
        {description}
      </p>
    </section>
  );
}
