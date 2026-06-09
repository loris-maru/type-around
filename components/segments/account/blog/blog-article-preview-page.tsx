"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import { BLOG_ARTICLE_PREVIEW_STORAGE_KEY } from "@/constant/BLOG_ARTICLE_PREVIEW_STORAGE_KEY";
import { useStudio } from "@/hooks/use-studio";
import type { StudioBlogArticle } from "@/types/blog";

export default function BlogArticlePreviewPage() {
  const { studio } = useStudio();
  const [article, setArticle] =
    useState<StudioBlogArticle | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(
        BLOG_ARTICLE_PREVIEW_STORAGE_KEY
      );
      if (!raw) return;
      setArticle(JSON.parse(raw) as StudioBlogArticle);
    } catch {
      setArticle(null);
    }
  }, []);

  if (!article) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6">
        <p className="font-whisper text-neutral-500">
          No preview data available. Open preview from the
          article editor.
        </p>
        {studio?.id && (
          <Link
            href={`/account/${studio.id}?nav=articles`}
            className="font-medium font-whisper text-black underline"
          >
            Back to blog
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl px-6 py-12">
      {studio?.id && (
        <Link
          href={`/account/${studio.id}?nav=articles`}
          className="mb-8 inline-flex items-center gap-2 font-whisper text-neutral-600 text-sm transition-colors hover:text-black"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          Back to articles
        </Link>
      )}

      <article>
        <p className="mb-3 font-whisper text-neutral-500 text-xs uppercase tracking-[0.2em]">
          Preview
        </p>
        <h1 className="mb-4 font-bold font-ortank text-4xl text-black">
          {article.name || "Untitled"}
        </h1>
        {article.coverImage && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={article.coverImage}
              alt={article.name || "Article cover"}
              fill
              className="object-cover"
              unoptimized={
                article.coverImage.startsWith("data:") ||
                article.coverImage.includes(
                  "firebasestorage"
                ) ||
                article.coverImage.includes(
                  "storage.googleapis.com"
                )
              }
            />
          </div>
        )}
        {article.introduction && (
          <p className="mb-8 font-whisper text-lg text-neutral-700 leading-relaxed">
            {article.introduction}
          </p>
        )}
        <div
          className="prose prose-neutral max-w-none font-whisper [&_.blog-video-embed]:my-6 [&_img]:my-6 [&_img]:w-full [&_img]:rounded-lg [&_video]:my-6 [&_video]:w-full [&_video]:rounded-lg"
          /* biome-ignore lint/security/noDangerouslySetInnerHtml: rich text content from editor */
          dangerouslySetInnerHTML={{
            __html: article.content,
          }}
        />
        {article.authors.length > 0 && (
          <div className="mt-8 border-neutral-200 border-t pt-6">
            <span className="font-whisper text-neutral-500 text-xs uppercase tracking-wider">
              By
            </span>
            <p className="mt-1 font-medium font-whisper text-black text-sm">
              {article.authors.join(", ")}
            </p>
          </div>
        )}
        {article.keywords.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {article.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-neutral-100 px-3 py-1 font-whisper text-neutral-600 text-xs"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
