import TypefaceCharacterSetBlock from "@/components/segments/typeface/character-set-block";
import type { CharacterSetBlockData } from "@/types/layout-typeface";

export default function TypefacePageCharacterSetBlock({
  data,
  fonts,
}: {
  data: CharacterSetBlockData | undefined;
  fonts: {
    id?: string;
    styleName?: string;
    file?: string;
    salesFiles?: string[];
  }[];
}) {
  return (
    <TypefaceCharacterSetBlock
      data={data}
      fonts={fonts}
    />
  );
}
