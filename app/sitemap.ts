import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constant/SEO_METADATA";
import { getAllStudiosForDisplay } from "@/lib/firebase/studios";
import { slugify } from "@/utils/slugify";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const studios = await getAllStudiosForDisplay();

  const studioPages = studios.flatMap((studio) => {
    const studioSlug = studio.slug || slugify(studio.name);
    const studioUrl = `${SITE_URL}/studio/${studioSlug}`;

    const typefacePages = (studio.typefaces || []).map(
      (typeface) => ({
        url: `${studioUrl}/typeface/${slugify(typeface.name)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    );

    return [
      {
        url: studioUrl,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      ...typefacePages,
    ];
  });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/fonts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/studios`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/typefaces`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [...staticPages, ...studioPages];
}
