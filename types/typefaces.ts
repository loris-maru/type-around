export type Typeface = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  fonts: number;
  characters: number;
  releaseDate: string;
  category: string[] | null;
  studio: string;
};

export type Studio = {
  id: string;
  name: string;
  description: string;
  image: string;
  website: string;
  typefaces: Typeface[];
  email: string;
  imageCover: string;
  gradient: string[];
  socialMedia: {
    name: string;
    href: string;
    service: string;
  }[];
};
