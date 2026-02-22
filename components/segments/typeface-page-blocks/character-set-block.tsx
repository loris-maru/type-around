import TypefaceCharacterSetBlock from "@/components/segments/typeface/character-set-block";
import type { CharacterSetBlockData } from "@/types/layout-typeface";

export default function TypefacePageCharacterSetBlock({
  data,
}: {
  data: CharacterSetBlockData | undefined;
}) {
  return <TypefaceCharacterSetBlock data={data} />;
}
