"use client";

import { useState } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import type {
  BlogArticle,
  BlogBlockData,
} from "@/types/layout";

export default function StudioBlogBlock({
  data,
}: {
  data: BlogBlockData;
}) {
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
          className="flex items-center gap-2 text-sm font-whisper text-neutral-600 hover:text-black transition-colors mb-6 cursor-pointer"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          Back to articles
        </button>
        <article className="max-w-3xl">
          <h2 className="text-3xl font-ortank font-bold mb-4">
            {activeArticle.name}
          </h2>
          {activeArticle.introduction && (
            <p className="text-lg font-whisper text-neutral-700 mb-8 leading-relaxed">
              {activeArticle.introduction}
            </p>
          )}
          <div
            className="prose prose-neutral max-w-none font-whisper"
            /* biome-ignore lint/security/noDangerouslySetInnerHtml: rich text content from editor */
            dangerouslySetInnerHTML={{
              __html: activeArticle.content,
            }}
          />
          {activeArticle.authors.length > 0 && (
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <span className="text-xs font-whisper text-neutral-500 uppercase tracking-wider">
                By
              </span>
              <p className="text-sm font-whisper font-medium text-black mt-1">
                {activeArticle.authors.join(", ")}
              </p>
            </div>
          )}
          {activeArticle.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeArticle.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs font-whisper px-3 py-1 bg-neutral-100 rounded-full text-neutral-600"
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
        <h3 className="text-2xl font-ortank font-bold mb-8">
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
            <h4 className="text-base font-whisper font-semibold text-black mb-2">
              {article.name || "Untitled"}
            </h4>
            {article.introduction && (
              <p className="text-sm font-whisper text-neutral-600 line-clamp-3">
                {article.introduction}
              </p>
            )}
            {article.authors.length > 0 && (
              <p className="text-xs font-whisper text-neutral-400 mt-auto pt-3">
                {article.authors.join(", ")}
              </p>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
