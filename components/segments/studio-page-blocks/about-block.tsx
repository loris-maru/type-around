import StudioProfile from "@/components/segments/studio/profile";
import { ABOUT_BLOCK_MARGIN_PRESET_MAP } from "@/constant/ABOUT_BLOCK_MARGIN_PRESETS";
import type { AboutBlockData } from "@/types/layout";
import type { Studio } from "@/types/studio";
import { applyBlockBackgroundColor } from "@/utils/block-background-color";

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

export default function StudioAboutBlock({
  studio,
  data,
}: {
  studio: Studio;
  data?: AboutBlockData;
}) {
  const marginPreset = data?.margin;
  const marginValue =
    (marginPreset &&
      ABOUT_BLOCK_MARGIN_PRESET_MAP[marginPreset]) ||
    "";

  const sectionStyle: React.CSSProperties = {};
  applyBlockBackgroundColor(
    sectionStyle,
    data?.backgroundColor
  );
  if (data?.textColor) sectionStyle.color = data.textColor;
  if (marginValue) {
    sectionStyle.paddingLeft = marginValue;
    sectionStyle.paddingRight = marginValue;
  }

  return (
    <StudioProfile
      name={studio.name || ""}
      image={
        studio.thumbnail ||
        studio.avatar ||
        "/placeholders/studio_image_placeholder.svg"
      }
      description={studio.description || ""}
      designers={studio.designers ?? []}
      sectionStyle={
        Object.keys(sectionStyle).length > 0
          ? sectionStyle
          : undefined
      }
      textSizeClass={
        data?.textSize
          ? TEXT_SIZE_CLASSES[data.textSize]
          : undefined
      }
      textAlignClass={
        data?.textAlign
          ? TEXT_ALIGN_CLASSES[data.textAlign]
          : undefined
      }
      marginValue={marginValue}
      defaultMargin={!marginValue}
    />
  );
}
