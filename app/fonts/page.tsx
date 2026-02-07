import { getAllPublishedTypefaces } from "@/lib/firebase/studios";
import TypefaceCard from "@/components/molecules/cards/typefaces";
import type { Typeface } from "@/types/typefaces";

export default async function FontsPage() {
  const typefaces = await getAllPublishedTypefaces();

  // Map studio typefaces to the Typeface format expected by TypefaceCard
  const mappedTypefaces: Array<{
    studioName: string;
    typeface: Typeface;
  }> = typefaces.map((t) => ({
    studioName: t.studioName,
    typeface: {
      id: Number(t.id) || 0,
      category: t.category,
      name: t.name,
      hangeulName: t.hangeulName,
      slug: t.slug,
      description: t.description,
      icon:
        t.headerImage || "/mock/typefaces/icn_ortank.svg",
      fonts: t.fonts.map((f) => ({
        price: f.printPrice || f.price || 0,
        text: f.text || "",
        fullName: f.fullName || f.styleName,
        name: f.name || f.styleName,
        weight: f.weight,
        style:
          f.style || (f.isItalic ? "italic" : "normal"),
      })),
      characters: t.characters,
      releaseDate: t.releaseDate,
      studio: t.studioName,
    },
  }));

  if (mappedTypefaces.length === 0) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center px-10 py-32">
        <div className="text-center">
          <h1 className="text-3xl font-ortank font-bold mb-4">
            Fonts
          </h1>
          <p className="text-neutral-500 font-whisper">
            No published typefaces yet. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full px-10 py-32">
      <div className="mb-12">
        <h1 className="text-4xl font-ortank font-bold mb-4">
          All Fonts
        </h1>
        <p className="text-neutral-500 font-whisper">
          Discover {mappedTypefaces.length} typeface
          {mappedTypefaces.length !== 1 ? "s" : ""} from our
          community of designers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mappedTypefaces.map(({ studioName, typeface }) => (
          <TypefaceCard
            key={`${studioName}-${typeface.slug}`}
            studioName={studioName}
            typeface={typeface}
          />
        ))}
      </div>
    </div>
  );
}
