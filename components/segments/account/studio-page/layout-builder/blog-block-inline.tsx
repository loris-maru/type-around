"use client";

import { Reorder } from "motion/react";
import { useState } from "react";
import {
  RiAddLine,
  RiArticleLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiDraggable,
} from "react-icons/ri";
import type { BlogBlockInlineProps } from "@/types/components";
import type { BlogArticle } from "@/types/layout";
import BlogArticleModal from "./blog-article-modal";

export default function BlogBlockInline({
  data,
  onUpdateData,
  onRemove,
}: BlogBlockInlineProps) {
  const [editingArticle, setEditingArticle] =
    useState<BlogArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const articles = data.articles || [];

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdateData({ ...data, title: e.target.value });
  };

  const handleSaveArticle = (article: BlogArticle) => {
    const exists = articles.find(
      (a) => a.key === article.key
    );
    const updated = exists
      ? articles.map((a) =>
          a.key === article.key ? article : a
        )
      : [...articles, article];
    onUpdateData({ ...data, articles: updated });
    setEditingArticle(null);
    setIsCreating(false);
  };

  const handleRemoveArticle = (key: string) => {
    onUpdateData({
      ...data,
      articles: articles.filter((a) => a.key !== key),
    });
  };

  const handleReorderArticles = (
    newOrder: BlogArticle[]
  ) => {
    onUpdateData({ ...data, articles: newOrder });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-300 bg-white">
      {/* Header with drag handle, title input, and remove */}
      <div className="flex items-center gap-2 border-neutral-200 border-b px-3 py-3">
        <div className="shrink-0 cursor-grab">
          <RiDraggable className="h-4 w-4 text-neutral-400" />
        </div>
        <span className="shrink-0 font-medium font-whisper text-sm">
          Blog
        </span>
        <span className="shrink-0 text-neutral-300">—</span>
        <input
          type="text"
          value={data.title || ""}
          onChange={handleTitleChange}
          placeholder="Section title..."
          aria-label="Blog section title"
          className="flex-1 rounded border border-transparent px-2 py-1 font-whisper text-sm transition-colors hover:border-neutral-200 focus:border-neutral-300 focus:outline-none"
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove blog block"
          className="shrink-0 cursor-pointer rounded p-1 transition-colors hover:bg-neutral-100"
        >
          <RiCloseLine className="h-4 w-4 text-neutral-400 hover:text-black" />
        </button>
      </div>

      {/* Articles grid */}
      <div className="p-4">
        {articles.length === 0 ? (
          <div className="grid grid-cols-6 gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-neutral-300 border-dashed transition-colors hover:border-neutral-400"
            >
              <RiAddLine className="h-5 w-5 text-neutral-400" />
              <span className="sr-only">Add article</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Reorder.Group
              axis="x"
              values={articles}
              onReorder={handleReorderArticles}
              className="grid grid-cols-6 gap-2"
              style={{ display: "grid" }}
            >
              {articles.map((article) => (
                <Reorder.Item
                  key={article.key}
                  value={article}
                  className="group relative flex aspect-square cursor-grab flex-col items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-2 transition-shadow active:cursor-grabbing active:border-black active:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setEditingArticle(article)
                    }
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1"
                  >
                    <RiArticleLine className="h-5 w-5 text-neutral-500" />
                    <span className="w-full truncate text-center font-whisper text-[10px] text-neutral-600 leading-tight">
                      {article.name || "Untitled"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveArticle(article.key)
                    }
                    aria-label={`Remove article ${article.name || "Untitled"}`}
                    className="absolute -top-1.5 -right-1.5 hidden h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-neutral-300 bg-white opacity-0 transition-opacity group-hover:flex group-hover:opacity-100"
                  >
                    <RiDeleteBinLine className="h-3 w-3 text-red-500" />
                  </button>
                </Reorder.Item>
              ))}

              {/* Add button after existing articles */}
              {articles.length < 6 && (
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-neutral-300 border-dashed transition-colors hover:border-neutral-400"
                >
                  <RiAddLine className="h-5 w-5 text-neutral-400" />
                </button>
              )}
            </Reorder.Group>
          </div>
        )}
      </div>

      {/* Edit article modal */}
      {editingArticle && (
        <BlogArticleModal
          isOpen
          onClose={() => setEditingArticle(null)}
          onSave={handleSaveArticle}
          initialArticle={editingArticle}
        />
      )}

      {/* Create article modal */}
      {isCreating && (
        <BlogArticleModal
          isOpen
          onClose={() => setIsCreating(false)}
          onSave={handleSaveArticle}
        />
      )}
    </div>
  );
}
