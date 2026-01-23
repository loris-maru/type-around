import STUDIOS from "@/mock-data/studios";
import TypefaceLine from "../typeface/line";
import { Studio, Typeface } from "@/types/typefaces";
import { useMemo } from "react";

export default function TypefacesList() {
  const studiosWithIds: Studio[] = useMemo(() => {
    return STUDIOS.map((studio) => ({
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
          category: typeface.category || null,
        };
      }) as Typeface[],
    }));
  }, []);

  return (
    <div
      className="w-full flex flex-col py-24"
      id="families"
    >
      {studiosWithIds.map((studio, index) => {
        const totalFonts = studio.typefaces.reduce(
          (acc, typeface) => acc + typeface.fonts,
          0
        );
        return (
          <div key={studio.id}>
            <TypefaceLine
              familyName={studio.name}
              styles={6}
              fonts={totalFonts}
            />
            {index !== studiosWithIds.length - 1 && (
              <div className="relative w-full h-px bg-neutral-300 my-4" />
            )}
          </div>
        );
      })}
    </div>
  );
}
