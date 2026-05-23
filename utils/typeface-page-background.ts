import type { CSSProperties } from "react";
import type { TypefacePageBackground } from "@/types/studio";

const DEFAULT_TYPEFACE_PAGE_BACKGROUND: TypefacePageBackground =
  {
    type: "color",
    color: "#ffffff",
    image: "",
  };

export function getTypefacePageBackgroundStyle(
  background?: TypefacePageBackground | null
): CSSProperties {
  const bg = background ?? DEFAULT_TYPEFACE_PAGE_BACKGROUND;

  if (bg.type === "color") {
    return { backgroundColor: bg.color ?? "#ffffff" };
  }

  if (bg.type === "gradient") {
    return {
      background: `linear-gradient(180deg, ${bg.gradient?.from ?? "#FFF8E8"} 0%, ${bg.gradient?.to ?? "#F2F2F2"} 100%)`,
    };
  }

  if (bg.type === "image" && bg.image) {
    return {
      backgroundImage: `url(${bg.image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  return { backgroundColor: "#ffffff" };
}

export function resolveTypefacePageTitleFontUrl(
  pageTitleFont: string,
  pageTextFont: string,
  pageTitleFontSameAsText: boolean
): string {
  if (pageTitleFontSameAsText && pageTextFont.trim()) {
    return pageTextFont.trim();
  }
  if (pageTitleFont.trim()) {
    return pageTitleFont.trim();
  }
  return pageTextFont.trim();
}
