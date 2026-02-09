import type { Font } from "@/types/typefaces";
import FontLine from "./font-line";

export default function TypefaceShop({
  fonts,
  typefaceName = "",
}: {
  fonts: Font[];
  typefaceName?: string;
}) {
  return (
    <div className="relative my-[20vh] flex w-full flex-col gap-y-1">
      {fonts.map((font: Font, index: number) => (
        <div key={`${font.name}-${font.weight}`}>
          <FontLine
            font={font}
            typefaceName={typefaceName}
            text="모진 바람 5월 꽃봉오리"
          />
          {index !== fonts.length - 1 && (
            <div className="relative my-4 h-px w-full bg-neutral-300" />
          )}
        </div>
      ))}
    </div>
  );
}
