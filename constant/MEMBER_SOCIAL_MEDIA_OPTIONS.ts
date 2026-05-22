import { SOCIAL_MEDIA_PLATFORM_NAMES } from "@/constant/SOCIAL_MEDIA_ICONS";
import type { CustomSelectOption } from "@/types/components";

function formatPlatformLabel(platform: string): string {
  return (
    platform.charAt(0).toUpperCase() + platform.slice(1)
  );
}

export const MEMBER_SOCIAL_MEDIA_OPTIONS: CustomSelectOption[] =
  SOCIAL_MEDIA_PLATFORM_NAMES.map((platform) => ({
    value: platform,
    label: formatPlatformLabel(platform),
  }));
