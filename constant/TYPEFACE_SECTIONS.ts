export interface TypefaceSection {
  id: string;
  label: string;
}

export const TYPEFACE_SECTIONS: TypefaceSection[] = [
  { id: "information", label: "Information" },
  { id: "versions", label: "Versions" },
  { id: "fonts", label: "Fonts" },
  { id: "eula", label: "EULA" },
  { id: "specimen", label: "Specimen" },
  { id: "assets", label: "Assets" },
];
