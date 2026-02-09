import Footer from "@/components/global/footer";
import StudiosGrid from "@/components/segments/studios/studios-grid";
import { getAllStudiosForDisplay } from "@/lib/firebase/studios";
import type { Studio } from "@/types/typefaces";

export const dynamic = "force-dynamic";

export default async function AllStudiosPage() {
  const rawStudios = await getAllStudiosForDisplay();

  const studios: Studio[] = rawStudios.map((s, index) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: "",
    image: s.image,
    website: "",
    email: "",
    imageCover: "",
    gradient: [],
    socialMedia: [],
    typefaces: s.typefaces.map((t, tIndex) => ({
      id: index * 1000 + tIndex,
      name: t.name,
      hangeulName: "",
      slug: "",
      description: "",
      icon: "",
      category: [],
      characters: 0,
      releaseDate: "",
      studio: s.name,
      fonts: t.fonts.map((f) => ({
        fullName: f.name,
        name: f.name,
        weight: 400,
        style: "normal",
        price: 0,
        text: "",
      })),
    })),
  }));

  return (
    <div className="relative w-full px-10 py-32">
      <header className="relative mb-24 flex w-full flex-row items-baseline justify-between">
        <h3 className="section-title">The Studios</h3>
        <div className="font-whisper text-black text-sm">
          Total of {studios.length} studios
        </div>
      </header>

      <StudiosGrid studios={studios} />

      <Footer />
    </div>
  );
}
