import Footer from "@/components/global/footer";
import StudiosGrid from "@/components/segments/studios/studios-grid";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER,
  SITE_NAME,
  SITE_URL,
} from "@/constant/SEO_METADATA";
import { getAllStudiosForDisplay } from "@/lib/firebase/studios";
import type { Studio } from "@/types/typefaces";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "스튜디오",
  description: `${SITE_NAME}에서 독립적인 한국 타입 팩토리를 탐색하세요. 독특한 한글 글꼴을 만드는 스튜디오를 발견하세요.`,
  alternates: { canonical: `${SITE_URL}/studio` },
  openGraph: {
    ...DEFAULT_OPEN_GRAPH,
    title: `스튜디오 | ${SITE_NAME}`,
    description: "독립적인 한국 타입 팩토리를 탐색하세요.",
  },
  twitter: {
    ...DEFAULT_TWITTER,
    title: `스튜디오 | ${SITE_NAME}`,
  },
};

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
        <h1 className="section-title">The Studios</h1>
        <div className="font-whisper text-black text-sm">
          Total of {studios.length} studios
        </div>
      </header>

      <StudiosGrid studios={studios} />

      <Footer />
    </div>
  );
}
