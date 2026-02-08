/**
 * Maps social media platform names (lowercase) to react-icons identifiers.
 * Used to dynamically render the correct icon for each platform.
 */
export const SOCIAL_MEDIA_PLATFORM_NAMES = [
  "instagram",
  "twitter",
  "linkedin",
  "facebook",
  "behance",
  "dribbble",
  "github",
  "youtube",
  "tiktok",
  "pinterest",
  "threads",
  "mastodon",
  "bluesky",
] as const;

export type SocialMediaPlatform =
  (typeof SOCIAL_MEDIA_PLATFORM_NAMES)[number];
