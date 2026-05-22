import {
  DEFAULT_TYPEFACE_SUBSECTION,
  isValidTypefaceSubsection,
} from "@/constant/TYPEFACE_SECTIONS";

export function getTypefaceSubsectionFromSearchParams(
  searchParams: Pick<URLSearchParams, "get">
): string {
  const fromUrl =
    searchParams.get("subsection") ??
    searchParams.get("section");

  return isValidTypefaceSubsection(fromUrl)
    ? fromUrl
    : DEFAULT_TYPEFACE_SUBSECTION;
}
