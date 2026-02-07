"use client";

import { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import type { BlogArticleModalProps } from "@/types/components";
import { generateUUID } from "@/utils/generate-uuid";
import RichTextEditor from "./rich-text-editor";

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
    document.body.style.overflow = "hidden";
    return () => {
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

      <div className="relative bg-white rounded-lg w-full max-w-3xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 shrink-0">
          <h2 className="font-ortank text-xl font-bold">
            {initialArticle
              ? "Edit Article"
              : "New Article"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
          {/* Article name */}
          <div>
            <label
              htmlFor="article-name"
              className="block text-sm font-semibold text-black mb-1"
            >
              Article name
            </label>
            <input
              type="text"
              id="article-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter article name"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>

          {/* Introduction */}
          <div>
            <label
              htmlFor="article-introduction"
              className="block text-sm font-semibold text-black mb-1"
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
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
            />
          </div>

          {/* Content (rich text) */}
          <div>
            <span className="block text-sm font-semibold text-black mb-1">
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
              className="block text-sm font-semibold text-black mb-1"
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
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Separate multiple authors with commas
            </p>
          </div>

          {/* Keywords */}
          <div>
            <label
              htmlFor="article-keywords"
              className="block text-sm font-semibold text-black mb-1"
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
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Separate multiple keywords with commas
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 bg-black text-white font-whisper font-medium rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Save Article
          </button>
        </div>
      </div>
    </div>
  );
}
