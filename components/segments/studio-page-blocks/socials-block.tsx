import StudioSocialsBlock from "@/components/segments/studio/socials-block";
import type { SocialsBlockData } from "@/types/layout";
import type { Studio } from "@/types/studio";

export default function StudioPageSocialsBlock({
  studio,
  data,
}: {
  studio: Studio;
  data?: SocialsBlockData;
}) {
  return (
    <StudioSocialsBlock
      socialMedia={studio.socialMedia ?? []}
      displayFontUrl={studio.headerFont}
      data={data}
    />
  );
}
