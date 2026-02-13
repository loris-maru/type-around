import {
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { typefaceVisionToSearchString } from "@/constant/TYPEFACE_VISION";
import { db } from "@/lib/firebase/config";
import type { SearchableItem } from "@/types/search";
import { slugify } from "@/utils/slugify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items: SearchableItem[] = [];
    const allStudiosQuery = query(
      collection(db, "studios")
    );
    const snapshot = await getDocs(allStudiosQuery);

    for (const docData of snapshot.docs) {
      const rawData = docData.data();
      const studioName = rawData.name || "";

      if (!studioName) continue;

      const studioSlug = slugify(studioName);

      // Add the studio itself
      items.push({
        id: `studio-${docData.id}`,
        name: studioName,
        type: "studio",
        href: `/studio/${studioSlug}`,
      });

      // Add designers from the studio
      const designers = rawData.designers || [];
      for (const designer of designers) {
        const fullName =
          `${designer.firstName || ""} ${designer.lastName || ""}`.trim();
        if (fullName) {
          items.push({
            id: `designer-${docData.id}-${designer.id || fullName}`,
            name: fullName,
            type: "designer",
            href: `/studio/${studioSlug}`,
            meta: studioName,
          });
        }
      }

      // Add published typefaces from the studio
      const typefaces = rawData.typefaces || [];
      for (const typeface of typefaces) {
        if (typeface.published && typeface.name) {
          const typefaceSlug = slugify(typeface.name);
          const visionSearch = typefaceVisionToSearchString(
            {
              usage: typeface.visionUsage,
              contrast: typeface.visionContrast,
              width: typeface.visionWidth,
              playful: typeface.visionPlayful,
              frame: typeface.visionFrame,
              serif: typeface.visionSerif,
            }
          );

          items.push({
            id: `typeface-${typeface.id}`,
            name: typeface.name,
            type: "typeface",
            href: `/studio/${studioSlug}/typeface/${typefaceSlug}`,
            meta: studioName,
            searchMeta: visionSearch || undefined,
          });
        }
      }
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
