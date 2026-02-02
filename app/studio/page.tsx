import StudioCard from "@/components/molecules/cards/studios";
import STUDIOS from "@/mock-data/studios";
import { Studio, Typeface } from "@/types/typefaces";

export default function AllStudiosPage() {
  const studiosWithIds: Studio[] = STUDIOS.map(
    (studio) => ({
      ...studio,
      typefaces: studio.typefaces.map((typeface, index) => {
        const hash = studio.id
          .split("")
          .reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0
          );
        return {
          ...typeface,
          id: hash + index,
          category: typeface.category || [],
          hangeulName:
            "hangeulName" in typeface &&
            typeof typeface.hangeulName === "string"
              ? typeface.hangeulName
              : "오흐탕크",
          gradient:
            "gradient" in typeface &&
            typeof typeface.gradient === "string"
              ? typeface.gradient
              : Array.isArray(studio.gradient)
                ? studio.gradient[0]
                : studio.gradient,
          fonts: typeface.fonts.map((font) => ({
            ...font,
            price:
              "price" in font
                ? (font as { price: number }).price
                : 0,
            text:
              "text" in font
                ? (font as { text: string }).text
                : font.fullName,
          })),
        };
      }) as Typeface[],
    })
  );

  return (
    <div className="relative w-full">
      <header className="relative w-full flex flex-row justify-between items-center mb-12">
        <h3 className="section-title">The Studios</h3>
        <div className="font-whisper text-sm text-black">
          Total of {studiosWithIds.length} studios
        </div>
      </header>

      <div className="relative w-full grid grid-cols-3 gap-12">
        {studiosWithIds.map((studio) => (
          <StudioCard
            key={studio.id}
            studio={studio}
          />
        ))}
      </div>
    </div>
  );
}
