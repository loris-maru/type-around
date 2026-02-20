export interface TypefaceSection {
  id: string;
  label: string;
}

export const TYPEFACE_SECTIONS: TypefaceSection[] = [
  { id: "information", label: "Information" },
  { id: "versions", label: "Versions" },
  { id: "shop", label: "Shop" },
  { id: "fonts", label: "Fonts" },
  { id: "packages", label: "Packages" },
  { id: "eula", label: "EULA" },
  { id: "specimen", label: "Specimen" },
  { id: "assets", label: "Assets" },
];
