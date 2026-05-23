import type { StudioSocialPlatformId } from "@/constant/STUDIO_SOCIAL_PLATFORMS";

function stripAt(handle: string): string {
  return handle.replace(/^@+/, "").trim();
}

/** Display label (e.g. loris_maru) from stored username or URL */
export function getSocialHandleLabel(
  value: string
): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const path = new URL(trimmed).pathname.replace(
        /\/$/,
        ""
      );
      const segment = path.split("/").filter(Boolean).pop();
      return segment ? stripAt(segment) : trimmed;
    } catch {
      return trimmed;
    }
  }

  return stripAt(trimmed);
}

export function getSocialProfileHref(
  platform: StudioSocialPlatformId,
  value: string
): string {
  const trimmed = value.trim();
  if (!trimmed) return "#";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const handle = stripAt(trimmed);

  switch (platform) {
    case "instagram":
      return `https://instagram.com/${handle}`;
    case "twitter":
      return `https://x.com/${handle}`;
    case "linkedin":
      return `https://www.linkedin.com/in/${handle}`;
    case "behance":
      return `https://www.behance.net/${handle}`;
    default:
      return trimmed;
  }
}
