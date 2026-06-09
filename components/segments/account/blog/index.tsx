"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { RiAddLine } from "react-icons/ri";
import { useStudio } from "@/hooks/use-studio";
import { cn } from "@/utils/class-names";

export default function AccountBlog() {
  const { studio, isLoading } = useStudio();
  const params = useParams();
  const studioIdFromUrl = params?.id as string | undefined;
  const articles = studio?.blogArticles ?? [];
  const newArticleHref = studioIdFromUrl
    ? `/account/${studioIdFromUrl}/blog/new`
    : undefined;

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col gap-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-bold font-ortank text-3xl">
            Articles
          </h1>
          <p className="mt-2 font-whisper text-neutral-500 text-sm">
            Create and publish articles for your studio blog
            block.
          </p>
        </div>
        {newArticleHref ? (
          <Link
            href={newArticleHref}
            aria-label="New article"
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-black bg-transparent px-4 py-3 font-medium font-whisper text-black shadow-button transition-all duration-300 ease-in-out hover:bg-white hover:shadow-button-hover"
          >
            <RiAddLine className="h-4 w-4" />
            New article
          </Link>
        ) : (
          <button
            type="button"
            aria-label="New article"
            disabled
            className="flex shrink-0 cursor-not-allowed items-center gap-2 rounded-lg border border-neutral-300 bg-transparent px-4 py-3 font-medium font-whisper text-neutral-400 opacity-50"
          >
            <RiAddLine className="h-4 w-4" />
            New article
          </button>
        )}
      </div>

      {articles.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-neutral-300 border-dashed bg-white/60 p-8 text-center">
          <p className="font-whisper text-neutral-500">
            No articles yet. Create your first article to
            show it on your studio page blog block.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {articles.map((article) => (
            <li key={article.key}>
              <Link
                href={`/account/${studio?.id}/blog/${article.key}`}
                className="flex items-center justify-between rounded-lg border border-neutral-300 bg-white px-5 py-4 transition-colors hover:border-black"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold font-whisper text-black text-lg">
                    {article.name || "Untitled"}
                  </h2>
                  {article.introduction && (
                    <p className="mt-1 line-clamp-2 font-whisper text-neutral-500 text-sm">
                      {article.introduction}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    "ml-4 shrink-0 rounded-full px-3 py-1 font-medium font-whisper text-xs uppercase tracking-wide",
                    article.published
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-600"
                  )}
                >
                  {article.published
                    ? "Published"
                    : "Draft"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
