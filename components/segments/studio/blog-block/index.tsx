"use client";

import { useState } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import { useStudioFonts } from "@/contexts/studio-fonts-context";
import type { StudioBlogBlockProps } from "@/types/components";
import type { BlogArticle } from "@/types/layout";

export default function StudioBlogBlock({
  data,
}: StudioBlogBlockProps) {
  const { displayFontFamily, textFontFamily } =
    useStudioFonts();
  const [activeArticle, setActiveArticle] =
    useState<BlogArticle | null>(null);

  if (!data.articles || data.articles.length === 0)
    return null;

  if (activeArticle) {
    return (
      <section className="relative w-full px-10 py-12">
        <button
          type="button"
          onClick={() => setActiveArticle(null)}
          className="mb-6 flex cursor-pointer items-center gap-2 text-neutral-600 text-sm transition-colors hover:text-black"
          style={{ fontFamily: textFontFamily }}
        >
          <RiArrowLeftLine className="w-4 h-4" />
          Back to articles
        </button>
        <article className="max-w-3xl">
          <h2
            className="mb-4 font-bold text-3xl"
            style={{ fontFamily: displayFontFamily }}
          >
            {activeArticle.name}
          </h2>
          {activeArticle.introduction && (
            <p
              className="mb-8 text-lg text-neutral-700 leading-relaxed"
              style={{ fontFamily: textFontFamily }}
            >
              {activeArticle.introduction}
            </p>
          )}
          <div
            className="prose prose-neutral max-w-none"
            style={{ fontFamily: textFontFamily }}
            /* biome-ignore lint/security/noDangerouslySetInnerHtml: rich text content from editor */
            dangerouslySetInnerHTML={{
              __html: activeArticle.content,
            }}
          />
          {activeArticle.authors.length > 0 && (
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <span
                className="text-neutral-500 text-xs uppercase tracking-wider"
                style={{ fontFamily: textFontFamily }}
              >
                By
              </span>
              <p
                className="mt-1 font-medium text-black text-sm"
                style={{ fontFamily: textFontFamily }}
              >
                {activeArticle.authors.join(", ")}
              </p>
            </div>
          )}
          {activeArticle.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeArticle.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-600 text-xs"
                  style={{ fontFamily: textFontFamily }}
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </article>
      </section>
    );
  }

  return (
    <section className="relative w-full px-10 py-12">
      {data.title && (
        <h3
          className="mb-8 font-bold text-2xl"
          style={{ fontFamily: displayFontFamily }}
        >
          {data.title}
        </h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.articles.map((article) => (
          <button
            key={article.key}
            type="button"
            onClick={() => setActiveArticle(article)}
            className="flex flex-col p-5 border border-neutral-200 rounded-lg bg-white hover:border-black transition-colors text-left cursor-pointer"
          >
            <h4
              className="mb-2 font-semibold text-base text-black"
              style={{ fontFamily: displayFontFamily }}
            >
              {article.name || "Untitled"}
            </h4>
            {article.introduction && (
              <p
                className="line-clamp-3 text-neutral-600 text-sm"
                style={{ fontFamily: textFontFamily }}
              >
                {article.introduction}
              </p>
            )}
            {article.authors.length > 0 && (
              <p
                className="mt-auto pt-3 text-neutral-400 text-xs"
                style={{ fontFamily: textFontFamily }}
              >
                {article.authors.join(", ")}
              </p>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
