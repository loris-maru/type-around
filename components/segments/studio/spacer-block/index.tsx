import { SPACER_CLASS_MAP } from "@/constant/BLOCK_CLASS_MAPS";
import type { StudioSpacerBlockProps } from "@/types/components";

export default function StudioSpacerBlock({
  data,
}: StudioSpacerBlockProps) {
  return (
    <div
      className={SPACER_CLASS_MAP[data.size || "m"]}
      aria-hidden="true"
    />
  );
}
