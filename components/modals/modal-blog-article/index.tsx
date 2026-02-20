"use client";

import { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import RichTextEditor from "@/components/segments/account/studio-page/layout-builder/rich-text-editor";
import type { BlogArticleModalProps } from "@/types/components";
import { generateUUID } from "@/utils/generate-uuid";

export default function BlogArticleModal({
  isOpen,
  onClose,
  onSave,
  initialArticle,
}: BlogArticleModalProps) {
  const [name, setName] = useState(
    initialArticle?.name || ""
  );
  const [introduction, setIntroduction] = useState(
    initialArticle?.introduction || ""
  );
  const [content, setContent] = useState(
    initialArticle?.content || ""
  );
  const [authorsInput, setAuthorsInput] = useState(
    (initialArticle?.authors || []).join(", ")
  );
  const [keywordsInput, setKeywordsInput] = useState(
    (initialArticle?.keywords || []).join(", ")
  );

  const handleSave = () => {
    const authors = authorsInput
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    onSave({
      key: initialArticle?.key || generateUUID(),
      name,
      introduction,
      content,
      authors,
      keywords,
    });
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center overflow-hidden">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            {initialArticle
              ? "Edit Article"
              : "New Article"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
          {/* Article name */}
          <div>
            <label
              htmlFor="article-name"
              className="mb-1 block font-semibold text-black text-sm"
            >
              Article name
            </label>
            <input
              type="text"
              id="article-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter article name"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Introduction */}
          <div>
            <label
              htmlFor="article-introduction"
              className="mb-1 block font-semibold text-black text-sm"
            >
              Introduction
            </label>
            <textarea
              id="article-introduction"
              value={introduction}
              onChange={(e) =>
                setIntroduction(e.target.value)
              }
              placeholder="Brief introduction to the article"
              rows={3}
              className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Content (rich text) */}
          <div>
            <span className="mb-1 block font-semibold text-black text-sm">
              Content
            </span>
            <RichTextEditor
              content={content}
              onChange={setContent}
            />
          </div>

          {/* Authors */}
          <div>
            <label
              htmlFor="article-authors"
              className="mb-1 block font-semibold text-black text-sm"
            >
              Authors
            </label>
            <input
              type="text"
              id="article-authors"
              value={authorsInput}
              onChange={(e) =>
                setAuthorsInput(e.target.value)
              }
              placeholder="Author 1, Author 2, ..."
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="mt-1 text-neutral-400 text-xs">
              Separate multiple authors with commas
            </p>
          </div>

          {/* Keywords */}
          <div>
            <label
              htmlFor="article-keywords"
              className="mb-1 block font-semibold text-black text-sm"
            >
              Keywords
            </label>
            <input
              type="text"
              id="article-keywords"
              value={keywordsInput}
              onChange={(e) =>
                setKeywordsInput(e.target.value)
              }
              placeholder="keyword1, keyword2, ..."
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="mt-1 text-neutral-400 text-xs">
              Separate multiple keywords with commas
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-neutral-200 border-t p-6">
          <button
            type="button"
            onClick={handleSave}
            className="w-full cursor-pointer rounded-lg bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800"
          >
            Save Article
          </button>
        </div>
      </div>
    </div>
  );
}
