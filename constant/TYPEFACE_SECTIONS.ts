export interface TypefaceSection {
  id: string;
  label: string;
}

export const TYPEFACE_SECTIONS: TypefaceSection[] = [
  { id: "information", label: "Information" },
  { id: "fonts", label: "Fonts" },
  { id: "packages", label: "Packages" },
  { id: "character-set", label: "Character set" },
  { id: "designers", label: "Contributors" },
  { id: "eula", label: "EULA" },
  { id: "specimen", label: "Specimen" },
  { id: "type-tester", label: "Type tester" },
  { id: "typeface-page", label: "⚡ Page builder" },
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
