import type { Studio } from "@/types/studio";
import type { Studio as DisplayStudio } from "@/types/typefaces";

export function toDisplayStudio(
  studio: Studio
): DisplayStudio {
  return {
    id: studio.id,
    name: studio.name,
    description: "",
    image:
      studio.thumbnail ||
      studio.avatar ||
      "/placeholders/studio_image_placeholder.webp",
    website: studio.website,
    email: studio.contactEmail,
    imageCover: studio.thumbnail || "",
    gradient: [
      studio.gradient?.from || "#FFF8E8",
      studio.gradient?.to || "#F2F2F2",
    ],
    socialMedia: studio.socialMedia.map((sm) => ({
      name: sm.name,
      href: sm.url,
      service: sm.name.toLowerCase(),
    })),
    typefaces: studio.typefaces.map((tf, index) => ({
      id: index,
      category: tf.category || [],
      name: tf.name,
      hangeulName: tf.hangeulName || "",
      slug: tf.slug,
      description: tf.description,
      icon: tf.heroLetter || tf.headerImage || "",
      fonts: tf.fonts.map((f) => ({
        price: f.printPrice || f.price || 0,
        text: f.text || "",
        fullName: f.fullName || f.styleName,
        name: f.name || f.styleName,
        weight: f.weight,
        style:
          f.style || (f.isItalic ? "italic" : "normal"),
      })),
      characters: tf.characters,
      releaseDate: tf.releaseDate,
      studio: tf.studio,
      gradient: tf.gradient,
    })),
  };
}
