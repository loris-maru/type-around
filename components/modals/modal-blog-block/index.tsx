"use client";

import { useState } from "react";
import {
  RiArticleLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import { ButtonModalSave } from "@/components/molecules/buttons";
import { useModalOpen } from "@/hooks/use-modal-open";
import { useStudio } from "@/hooks/use-studio";
import type { BlogBlockData } from "@/types/layout";
import { cn } from "@/utils/class-names";

type BlogBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BlogBlockData) => void;
  initialData?: BlogBlockData;
};

export default function BlogBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: BlogBlockModalProps) {
  useModalOpen(isOpen);
  if (!isOpen) return null;
  return (
    <BlogBlockModalInner
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
    />
  );
}

function BlogBlockModalInner({
  onClose,
  onSave,
  initialData,
}: Omit<BlogBlockModalProps, "isOpen">) {
  const { studio } = useStudio();
  const articles = studio?.blogArticles ?? [];

  const [title, setTitle] = useState(
    initialData?.title ?? ""
  );
  const [selectedKeys, setSelectedKeys] = useState<
    Set<string>
  >(() => new Set(initialData?.articleKeys ?? []));

  const toggle = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSave = () => {
    onSave({
      title,
      articles: initialData?.articles ?? [],
      articleKeys: Array.from(selectedKeys),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center overflow-hidden"
      data-modal
      data-lenis-prevent
    >
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 cursor-default bg-black/50"
        onClick={onClose}
      />

      <div className="relative mx-4 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            Blog block
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
          {/* Section title */}
          <div>
            <label
              htmlFor="blog-block-title"
              className="mb-1 block font-semibold text-black text-sm"
            >
              Section title
            </label>
            <input
              type="text"
              id="blog-block-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Our articles"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Article picker */}
          <div>
            <p className="mb-2 font-semibold text-black text-sm">
              Select articles to display
            </p>
            {articles.length === 0 ? (
              <p className="font-whisper text-neutral-500 text-sm">
                No articles yet. Create articles in the
                Articles section of your account.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {articles.map((article) => {
                  const checked = selectedKeys.has(
                    article.key
                  );
                  return (
                    <li key={article.key}>
                      <button
                        type="button"
                        onClick={() => toggle(article.key)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                          checked
                            ? "border-black bg-neutral-50"
                            : "border-neutral-200 hover:border-neutral-400"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                            checked
                              ? "border-black bg-black"
                              : "border-neutral-300"
                          )}
                        >
                          {checked && (
                            <RiCheckLine className="h-3 w-3 text-white" />
                          )}
                        </span>
                        <RiArticleLine className="h-4 w-4 shrink-0 text-neutral-400" />
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-medium font-whisper text-sm">
                            {article.name || "Untitled"}
                          </span>
                          {article.introduction && (
                            <span className="mt-0.5 line-clamp-1 font-whisper text-neutral-500 text-xs">
                              {article.introduction}
                            </span>
                          )}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 font-whisper text-[10px] uppercase tracking-wide",
                            article.published
                              ? "bg-black text-white"
                              : "bg-neutral-100 text-neutral-500"
                          )}
                        >
                          {article.published
                            ? "Published"
                            : "Draft"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-neutral-200 border-t p-6">
          <ButtonModalSave
            type="button"
            onClick={handleSave}
            label="Save"
            aria-label="Save blog block"
          />
        </div>
      </div>
    </div>
  );
}
