export const SITE_NAME = "글자곁 Type-Around";
export const SITE_DESCRIPTION =
  "글자곁(글자궤도)은 독립적인 한국 타입 팩토리의 미래를 이끌어갑니다. 독립적인 한국 타입 팩토리를 발견하고 지원하며, 그들의 독특한 글꼴을 만나보세요.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://type-around.com";
/** Place Type-Around_OG_image.jpg in the public folder. Recommended: 1200×630px for social sharing. */
export const OG_IMAGE_PATH = "/Type-Around_OG_image.jpg";

export const DEFAULT_OPEN_GRAPH = {
  type: "website" as const,
  locale: "en_US" as const,
  siteName: SITE_NAME,
  images: [
    {
      url: OG_IMAGE_PATH,
      width: 1200,
      height: 630,
      alt: SITE_NAME,
    },
  ],
};

export const DEFAULT_TWITTER = {
  card: "summary_large_image" as const,
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  images: [OG_IMAGE_PATH],
};
