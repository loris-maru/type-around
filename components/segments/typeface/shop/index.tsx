import { Font } from "@/types/typefaces";
import FontLine from "./font-line";

export default function TypefaceShop({
  fonts,
}: {
  fonts: Font[];
}) {
  return (
    <div className="relative w-full flex flex-col gap-y-1 my-[20vh]">
      {fonts.map((font: Font, index: number) => (
        <div key={`${font.name}-${index}`}>
          <FontLine
            fontName={font.name}
            price={font.price}
            weight={font.weight}
            text="모진 바람 5월 꽃봉오리"
          />
          {index !== fonts.length - 1 && (
            <div className="relative w-full h-px bg-neutral-300 my-4" />
          )}
        </div>
      ))}
    </div>
  );
}
