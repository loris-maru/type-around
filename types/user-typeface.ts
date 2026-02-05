import { Font } from "./typefaces";

export type UserTypeface = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  fonts: Font[];
  characters: number;
  releaseDate: string;
  studio: string;
  gradient?: string;
};
