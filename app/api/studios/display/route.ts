import { NextResponse } from "next/server";
import { getAllStudiosForDisplay } from "@/lib/firebase/studios";
import type { Studio } from "@/types/typefaces";

/**
 * GET /api/studios/display
 *
 * Returns all studios with typefaces for public display
 * (horizontal section, studio cards, etc.)
 */
export async function GET() {
  try {
    const rawStudios = await getAllStudiosForDisplay();
    const allTypefaces = rawStudios.flatMap(
      (s) => s.typefaces
    );
    console.log(
      "[api/studios/display] Typefaces fetched from Firebase:",
      allTypefaces
    );

    const studios: Studio[] = rawStudios.map(
      (s, index) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: "",
        image: s.image,
        website: "",
        email: "",
        imageCover: "",
        gradient: Array.isArray(s.gradient)
          ? s.gradient
          : typeof s.gradient === "object" &&
              s.gradient !== null &&
              "from" in s.gradient
            ? [
                (s.gradient as { from: string }).from,
                (s.gradient as { to: string }).to,
              ]
            : [
                typeof s.gradient === "string"
                  ? s.gradient
                  : "#FFF8E8",
              ],
        socialMedia: [],
        typefaces: s.typefaces.map((t, tIndex) => ({
          id: index * 1000 + tIndex,
          name: t.name,
          hangeulName: t.hangeulName ?? "",
          slug: t.slug,
          description: t.description,
          icon: t.icon,
          category: t.category,
          characters: t.characters,
          releaseDate: t.releaseDate,
          studio: s.name,
          fonts: t.fonts.map((f) => ({
            fullName: f.fullName ?? f.name,
            name: f.name,
            weight: f.weight ?? 400,
            style: f.style ?? "normal",
            price: f.price ?? 0,
            text: f.text ?? "",
          })),
        })),
      })
    );

    return NextResponse.json(studios);
  } catch (error) {
    console.error("[api/studios/display]", error);
    return NextResponse.json(
      { error: "Failed to fetch studios" },
      { status: 500 }
    );
  }
}
