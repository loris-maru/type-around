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
    <div className="bg-white border border-neutral-300 rounded-lg overflow-hidden">
      {/* Header with drag handle, title input, and remove */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-neutral-200">
        <div className="shrink-0 cursor-grab">
          <RiDraggable className="w-4 h-4 text-neutral-400" />
        </div>
        <span className="text-sm font-whisper font-medium shrink-0">
          Blog
        </span>
        <span className="text-neutral-300 shrink-0">—</span>
        <input
          type="text"
          value={data.title || ""}
          onChange={handleTitleChange}
          placeholder="Section title..."
          className="flex-1 text-sm font-whisper px-2 py-1 border border-transparent rounded hover:border-neutral-200 focus:border-neutral-300 focus:outline-none transition-colors"
        />
        <button
          type="button"
          onClick={onRemove}
          className="p-1 hover:bg-neutral-100 rounded transition-colors cursor-pointer shrink-0"
        >
          <RiCloseLine className="w-4 h-4 text-neutral-400 hover:text-black" />
        </button>
      </div>

      {/* Articles grid */}
      <div className="p-4">
        {articles.length === 0 ? (
          <div className="grid grid-cols-6 gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="aspect-square flex flex-col items-center justify-center gap-1 border-2 border-dashed border-neutral-300 rounded-lg hover:border-neutral-400 transition-colors cursor-pointer"
            >
              <RiAddLine className="w-5 h-5 text-neutral-400" />
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
                  className="relative group aspect-square flex flex-col items-center justify-center p-2 bg-neutral-50 border border-neutral-200 rounded-lg cursor-grab active:cursor-grabbing active:shadow-md active:border-black transition-shadow"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setEditingArticle(article)
                    }
                    className="flex flex-col items-center gap-1 w-full h-full justify-center cursor-pointer"
                  >
                    <RiArticleLine className="w-5 h-5 text-neutral-500" />
                    <span className="text-[10px] text-neutral-600 font-whisper text-center leading-tight truncate w-full">
                      {article.name || "Untitled"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveArticle(article.key)
                    }
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-neutral-300 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hidden group-hover:flex"
                  >
                    <RiDeleteBinLine className="w-3 h-3 text-red-500" />
                  </button>
                </Reorder.Item>
              ))}

              {/* Add button after existing articles */}
              {articles.length < 6 && (
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="aspect-square flex flex-col items-center justify-center gap-1 border-2 border-dashed border-neutral-300 rounded-lg hover:border-neutral-400 transition-colors cursor-pointer"
                >
                  <RiAddLine className="w-5 h-5 text-neutral-400" />
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
