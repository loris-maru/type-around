import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/global/footer";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER,
  SITE_NAME,
  SITE_URL,
} from "@/constant/SEO_METADATA";
import { getAllPublishedBlogArticles } from "@/lib/firebase/studios";

export const revalidate = 3600;
export const preferredRegion = ["icn1"];

export const metadata: Metadata = {
  title: "Blog",
  description: `Articles and updates from ${SITE_NAME} studios.`,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    ...DEFAULT_OPEN_GRAPH,
    title: `Blog | ${SITE_NAME}`,
    description: `Articles and updates from ${SITE_NAME} studios.`,
  },
  twitter: {
    ...DEFAULT_TWITTER,
    title: `Blog | ${SITE_NAME}`,
  },
};

export default async function BlogPage() {
  const articles = await getAllPublishedBlogArticles();

  return (
    <div className="relative w-full px-10 py-32">
      <div className="mb-12">
        <h1 className="mb-4 font-bold font-ortank text-4xl">
          Blog
        </h1>
        <p className="font-whisper text-neutral-500">
          {articles.length > 0
            ? `Latest articles from ${SITE_NAME} studios.`
            : "Published studio articles will appear here."}
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-neutral-300 border-dashed bg-white/60 px-6 py-16 text-center">
          <p className="font-whisper text-neutral-500">
            No published articles yet.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li
              key={`${article.studioSlug}-${article.key}`}
            >
              <Link
                href={`/studio/${article.studioSlug}`}
                className="flex h-full flex-col rounded-lg border border-neutral-300 bg-white p-6 transition-colors hover:border-black"
              >
                <h2 className="mb-2 font-semibold font-whisper text-black text-xl">
                  {article.name || "Untitled"}
                </h2>
                {article.introduction && (
                  <p className="mb-4 line-clamp-4 flex-1 font-whisper text-neutral-600 text-sm leading-relaxed">
                    {article.introduction}
                  </p>
                )}
                <span className="font-whisper text-neutral-400 text-xs uppercase tracking-wide">
                  {article.studioName}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Footer />
    </div>
  );
}
