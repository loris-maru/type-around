export type Font = {
  price: number;
  text: string;
  fullName: string;
  name: string;
  weight: number;
  style: string;
};

export type Typeface = {
  id: number;
  category: string[];
  name: string;
  hangeulName?: string;
  slug: string;
  description: string;
  icon: string;
  fonts: Font[];
  characters: number;
  releaseDate: string;
  studio: string;
  gradient?: string;
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
