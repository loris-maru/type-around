import TYPE_FAMILIES from "../type-families";

const STUDIOS = [
  {
    id: "655ff073-cc90-48ff-a8c8-808e8418888d",
    name: "lo-ol type",
    description:
      "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
    gradient: ["#FFF8E8", "#F2F2F2"],
    image: "/mock/profile/studio_profile_01.png",
    website: "https://www.lo-ol.design",
    email: "hello@lo-ol.design",
    imageCover: "/mock/studios/profile_studio.webp",
    socialMedia: [
      {
        name: "Instagram",
        href: "https://www.instagram.com/lo-ol.studio",
        service: "instagram",
      },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/lo-ol-studio",
        service: "linkedin",
      },
    ],
    typefaces: [
      {
        name: "Giparan",
        slug: "giparan",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_giparan.svg",
        characters: 1456,
        releaseDate: "2024-01-01",
        category: ["sans-serif"],
        studio: "lo-ol type",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "giparan")
            ?.fonts || [],
      },
      {
        name: "Arvana",
        slug: "arvana",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_arvana.svg",
        characters: 1024,
        releaseDate: "2024-01-01",
        category: ["serif"],
        studio: "lo-ol type",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "arvana")
            ?.fonts || [],
      },
      {
        name: "Ortank",
        slug: "ortank",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_ortank.svg",
        characters: 2800,
        releaseDate: "2024-01-01",
        category: ["sans-serif"],
        studio: "lo-ol type",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "ortank")
            ?.fonts || [],
      },
      {
        name: "Banya Mist",
        slug: "banya-mist",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_banya.svg",
        characters: 1456,
        releaseDate: "2024-01-01",
        category: ["serif"],
        studio: "lo-ol type",
        fonts:
          TYPE_FAMILIES.find(
            (tf) => tf.slug === "banya-mist"
          )?.fonts || [],
      },
    ],
  },
  {
    id: "2297e6ff-4b7c-47d3-a7da-975863006012",
    name: "Minjoo Type",
    description:
      "Vivamus ut lacinia nunc quisque congue nibh lacinia enim velit.",
    gradient: ["#FFF8E8", "#F2F2F2"],
    image: "/mock/profile/studio_profile_01.png",
    website: "https://www.lo-ol.design",
    email: "contact@minjootype.com",
    imageCover: "/mock/studios/profile_studio.webp",
    socialMedia: [
      {
        name: "Instagram",
        href: "https://www.instagram.com/minjootype",
        service: "instagram",
      },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/minjoo-type",
        service: "linkedin",
      },
    ],
    typefaces: [
      {
        name: "Giparan",
        slug: "giparan",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_giparan.svg",
        characters: 1456,
        releaseDate: "2024-01-01",
        category: ["sans-serif"],
        studio: "Minjoo Type",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "giparan")
            ?.fonts || [],
      },
      {
        name: "Arvana",
        slug: "arvana",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_arvana.svg",
        characters: 1024,
        releaseDate: "2024-01-01",
        category: ["serif"],
        studio: "Minjoo Type",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "arvana")
            ?.fonts || [],
      },
      {
        name: "Ortank",
        slug: "ortank",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_ortank.svg",
        characters: 2800,
        releaseDate: "2024-01-01",
        category: ["sans-serif"],
        studio: "Minjoo Type",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "ortank")
            ?.fonts || [],
      },
      {
        name: "Banya Mist",
        slug: "banya-mist",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_banya.svg",
        characters: 1456,
        releaseDate: "2024-01-01",
        category: ["serif"],
        studio: "Minjoo Type",
        fonts:
          TYPE_FAMILIES.find(
            (tf) => tf.slug === "banya-mist"
          )?.fonts || [],
      },
    ],
  },
  {
    id: "e83c73c5-42d0-40aa-aa5c-859a8c58c904",
    name: "Font Pia",
    description:
      "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
    gradient: ["#FFF8E8", "#F2F2F2"],
    image: "/mock/profile/studio_profile_01.png",
    website: "https://www.lo-ol.design",
    email: "info@fontpia.com",
    imageCover: "/mock/studios/profile_studio.webp",
    socialMedia: [
      {
        name: "Instagram",
        href: "https://www.instagram.com/fontpia",
        service: "instagram",
      },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/font-pia",
        service: "linkedin",
      },
    ],
    typefaces: [
      {
        name: "Giparan",
        slug: "giparan",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_giparan.svg",
        characters: 1456,
        releaseDate: "2024-01-01",
        category: ["sans-serif"],
        studio: "Font Pia",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "giparan")
            ?.fonts || [],
      },
      {
        name: "Arvana",
        slug: "arvana",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_arvana.svg",
        characters: 1024,
        releaseDate: "2024-01-01",
        category: ["serif"],
        studio: "Font Pia",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "arvana")
            ?.fonts || [],
      },
      {
        name: "Ortank",
        slug: "ortank",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_ortank.svg",
        characters: 2800,
        releaseDate: "2024-01-01",
        category: ["sans-serif"],
        studio: "Font Pia",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "ortank")
            ?.fonts || [],
      },
      {
        name: "Banya Mist",
        slug: "banya-mist",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_banya.svg",
        characters: 1456,
        releaseDate: "2024-01-01",
        category: ["serif"],
        studio: "Font Pia",
        fonts:
          TYPE_FAMILIES.find(
            (tf) => tf.slug === "banya-mist"
          )?.fonts || [],
      },
    ],
  },
  {
    id: "0ab4b7de-649b-44d5-b164-695de9435361",
    name: "Moa Design",
    description:
      "Vivamus ut lacinia nunc quisque congue nibh lacinia enim velit.",
    gradient: ["#FFF8E8", "#F2F2F2"],
    image: "/mock/profile/studio_profile_01.png",
    website: "https://www.lo-ol.design",
    email: "hello@moadesign.com",
    imageCover: "/mock/studios/profile_studio.webp",
    socialMedia: [
      {
        name: "Instagram",
        href: "https://www.instagram.com/moadesign",
        service: "instagram",
      },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/moa-design",
        service: "linkedin",
      },
    ],
    typefaces: [
      {
        name: "Giparan",
        slug: "giparan",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_giparan.svg",
        characters: 1456,
        releaseDate: "2024-01-01",
        category: ["sans-serif"],
        studio: "Moa Design",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "giparan")
            ?.fonts || [],
      },
      {
        name: "Arvana",
        slug: "arvana",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_arvana.svg",
        characters: 1024,
        releaseDate: "2024-01-01",
        category: ["serif"],
        studio: "Moa Design",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "arvana")
            ?.fonts || [],
      },
      {
        name: "Ortank",
        slug: "ortank",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_ortank.svg",
        characters: 2800,
        releaseDate: "2024-01-01",
        category: ["sans-serif"],
        studio: "Moa Design",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "ortank")
            ?.fonts || [],
      },
      {
        name: "Banya Mist",
        slug: "banya-mist",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_banya.svg",
        characters: 1456,
        releaseDate: "2024-01-01",
        category: ["serif"],
        studio: "Moa Design",
        fonts:
          TYPE_FAMILIES.find(
            (tf) => tf.slug === "banya-mist"
          )?.fonts || [],
      },
    ],
  },
  {
    id: "8336194b-7272-4799-99cf-9a2de8d71b2d",
    name: "Mijin Letters",
    description:
      "Vivamus ut lacinia nunc quisque congue nibh lacinia enim velit.",
    gradient: ["#FFF8E8", "#F2F2F2"],
    image: "/mock/profile/studio_profile_01.png",
    website: "https://www.lo-ol.design",
    email: "contact@mijinletters.com",
    imageCover: "/mock/studios/profile_studio.webp",
    socialMedia: [
      {
        name: "Instagram",
        href: "https://www.instagram.com/mijinletters",
        service: "instagram",
      },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/mijin-letters",
        service: "linkedin",
      },
    ],
    typefaces: [
      {
        name: "Giparan",
        slug: "giparan",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_giparan.svg",
        characters: 1456,
        releaseDate: "2024-01-01",
        category: ["sans-serif"],
        studio: "Mijin Letters",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "giparan")
            ?.fonts || [],
      },
      {
        name: "Arvana",
        slug: "arvana",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_arvana.svg",
        characters: 1024,
        releaseDate: "2024-01-01",
        category: ["serif"],
        studio: "Mijin Letters",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "arvana")
            ?.fonts || [],
      },
      {
        name: "Ortank",
        slug: "ortank",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_ortank.svg",
        characters: 2800,
        releaseDate: "2024-01-01",
        category: ["sans-serif"],
        studio: "Mijin Letters",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "ortank")
            ?.fonts || [],
      },
      {
        name: "Banya Mist",
        slug: "banya-mist",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_banya.svg",
        characters: 1456,
        releaseDate: "2024-01-01",
        category: ["serif"],
        studio: "Mijin Letters",
        fonts:
          TYPE_FAMILIES.find(
            (tf) => tf.slug === "banya-mist"
          )?.fonts || [],
      },
    ],
  },
  {
    id: "d77ce74f-45ce-4e65-b20f-1ccfda87e234",
    name: "Suyeong Han Studio",
    description:
      "Vivamus ut lacinia nunc quisque congue nibh lacinia enim velit.",
    gradient: ["#FFF8E8", "#F2F2F2"],
    image: "/mock/profile/studio_profile_01.png",
    website: "https://www.lo-ol.design",
    email: "hello@suyeonghan.com",
    imageCover: "/mock/studios/profile_studio.webp",
    socialMedia: [
      {
        name: "Instagram",
        href: "https://www.instagram.com/suyeonghan",
        service: "instagram",
      },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/suyeong-han-studio",
        service: "linkedin",
      },
    ],
    typefaces: [
      {
        name: "Giparan",
        slug: "giparan",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_giparan.svg",
        characters: 1456,
        releaseDate: "2024-01-01",
        category: ["sans-serif"],
        studio: "Suyeong Han Studio",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "giparan")
            ?.fonts || [],
      },
      {
        name: "Arvana",
        slug: "arvana",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_arvana.svg",
        characters: 1024,
        releaseDate: "2024-01-01",
        category: ["serif"],
        studio: "Suyeong Han Studio",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "arvana")
            ?.fonts || [],
      },
      {
        name: "Ortank",
        slug: "ortank",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_ortank.svg",
        characters: 2800,
        releaseDate: "2024-01-01",
        category: ["sans-serif"],
        studio: "Suyeong Han Studio",
        fonts:
          TYPE_FAMILIES.find((tf) => tf.slug === "ortank")
            ?.fonts || [],
      },
      {
        name: "Banya Mist",
        slug: "banya-mist",
        description:
          "Lorem ipsum dolor sit amet fermentum curabitur urna est luctus justo massa.",
        icon: "/mock/typefaces/icn_banya.svg",
        characters: 1456,
        releaseDate: "2024-01-01",
        category: ["serif"],
        studio: "Suyeong Han Studio",
        fonts:
          TYPE_FAMILIES.find(
            (tf) => tf.slug === "banya-mist"
          )?.fonts || [],
      },
    ],
  },
];

export default STUDIOS;
