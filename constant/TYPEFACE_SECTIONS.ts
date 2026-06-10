export interface TypefaceSection {
  id: string;
  label: string;
}

export const TYPEFACE_SECTIONS: TypefaceSection[] = [
  { id: "information", label: "Information" },
  { id: "designers", label: "Designers" },
  { id: "typeface-page", label: "Typeface page" },
  { id: "versions", label: "Versions" },
  { id: "shop", label: "Shop" },
  { id: "fonts", label: "Fonts" },
  { id: "packages", label: "Packages" },
  { id: "eula", label: "EULA" },
  { id: "specimen", label: "Specimen" },
];

export const DEFAULT_TYPEFACE_SUBSECTION =
  TYPEFACE_SECTIONS[0].id;

export function isValidTypefaceSubsection(
  id: string | null | undefined
): id is TypefaceSection["id"] {
  return (
    !!id &&
    TYPEFACE_SECTIONS.some((section) => section.id === id)
  );
}
