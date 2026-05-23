import type { ComponentType, SVGProps } from "react";
import IconBehance from "@/components/icons/icon-behance";
import IconInstagram from "@/components/icons/icon-instagram";
import IconLinkedin from "@/components/icons/icon-linkedin";
import IconTwitter from "@/components/icons/icon-twitter";

export type StudioSocialPlatformId =
  | "instagram"
  | "twitter"
  | "linkedin"
  | "behance";

export type StudioSocialPlatform = {
  id: StudioSocialPlatformId;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const STUDIO_SOCIAL_PLATFORMS: StudioSocialPlatform[] =
  [
    {
      id: "instagram",
      label: "Instagram",
      Icon: IconInstagram,
    },
    {
      id: "twitter",
      label: "X",
      Icon: IconTwitter,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      Icon: IconLinkedin,
    },
    {
      id: "behance",
      label: "Behance",
      Icon: IconBehance,
    },
  ];
