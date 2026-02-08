import type { SpacerBlockData } from "@/types/layout";

const SIZE_MAP = {
  s: "h-8",
  m: "h-16",
  l: "h-32",
  xl: "h-48",
} as const;

export default function StudioSpacerBlock({
  data,
}: {
  data: SpacerBlockData;
}) {
  return (
    <div
      className={SIZE_MAP[data.size || "m"]}
      aria-hidden="true"
    />
  );
}
