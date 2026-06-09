"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import {
  ButtonPreviewPage,
  ButtonSaveChanges,
} from "@/components/molecules/buttons";
import FileDropZone from "@/components/global/file-drop-zone";
import RichTextEditor from "@/components/segments/account/studio-page/layout-builder/rich-text-editor";
import { BLOG_ARTICLE_IMAGE_ACCEPT } from "@/constant/BLOG_ARTICLE_MEDIA_ACCEPT";
import { BLOG_ARTICLE_PREVIEW_STORAGE_KEY } from "@/constant/BLOG_ARTICLE_PREVIEW_STORAGE_KEY";
import { useStudio } from "@/hooks/use-studio";
import type { StudioBlogArticle } from "@/types/blog";
import { generateUUID } from "@/utils/generate-uuid";

type BlogArticleEditorPageProps = {
  articleKey: string;
  studioId: string;
};

export default function BlogArticleEditorPage({
  articleKey,
  studioId,
}: BlogArticleEditorPageProps) {
  const { studio, isLoading, updateBlogArticles } =
    useStudio();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const isNew = articleKey === "new";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const existingArticle = useMemo(
    () =>
      isNew
        ? null
        : ((studio?.blogArticles ?? []).find(
            (article) => article.key === articleKey
          ) ?? null),
    [articleKey, isNew, studio?.blogArticles]
  );

  const [name, setName] = useState(
    existingArticle?.name ?? ""
  );
  const [introduction, setIntroduction] = useState(
    existingArticle?.introduction ?? ""
  );
  const [content, setContent] = useState(
    existingArticle?.content ?? ""
  );
  const [authorsInput, setAuthorsInput] = useState(
    (existingArticle?.authors ?? []).join(", ")
  );
  const [keywordsInput, setKeywordsInput] = useState(
    (existingArticle?.keywords ?? []).join(", ")
  );
  const [coverImage, setCoverImage] = useState(
    existingArticle?.coverImage ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!existingArticle) return;
    setName(existingArticle.name);
    setIntroduction(existingArticle.introduction);
    setContent(existingArticle.content);
    setAuthorsInput(existingArticle.authors.join(", "));
    setKeywordsInput(existingArticle.keywords.join(", "));
    setCoverImage(existingArticle.coverImage ?? "");
  }, [existingArticle]);

  const buildArticle = useCallback(
    (published: boolean): StudioBlogArticle => {
      const now = new Date().toISOString();
      const authors = authorsInput
        .split(",")
        .map((author) => author.trim())
        .filter(Boolean);
      const keywords = keywordsInput
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

      return {
        key: isNew
          ? generateUUID()
          : (existingArticle?.key ?? articleKey),
        name,
        introduction,
        content,
        coverImage,
        authors,
        keywords,
        published,
        createdAt: existingArticle?.createdAt ?? now,
        updatedAt: now,
      };
    },
    [
      articleKey,
      authorsInput,
      content,
      coverImage,
      existingArticle,
      introduction,
      isNew,
      keywordsInput,
      name,
    ]
  );

  const handlePreview = () => {
    if (!studio?.id) return;
    const draft = buildArticle(
      existingArticle?.published ?? false
    );
    sessionStorage.setItem(
      BLOG_ARTICLE_PREVIEW_STORAGE_KEY,
      JSON.stringify(draft)
    );
    window.open(
      `/account/${studio.id}/blog/preview`,
      "_blank"
    );
  };

  const handlePublish = async () => {
    if (!studio) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      const article = buildArticle(true);
      const currentArticles = studio.blogArticles ?? [];
      const updatedArticles = isNew
        ? [...currentArticles, article]
        : currentArticles.map((item) =>
            item.key === article.key ? article : item
          );

      await updateBlogArticles(updatedArticles);
      router.push(`/account/${studio.id}?nav=articles`);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to publish article"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isMounted || isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
      </div>
    );
  }

  if (!isNew && studio && !existingArticle) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="font-whisper text-neutral-500">
          Article not found.
        </p>
        <Link
          href={`/account/${studio.id}?nav=articles`}
          className="font-medium font-whisper text-black underline"
        >
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col gap-8 pb-28">
      <div>
        <Link
          href={`/account/${studioId}?nav=articles`}
          className="mb-4 inline-flex items-center gap-2 font-whisper text-neutral-600 text-sm transition-colors hover:text-black"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          Back to articles
        </Link>
        <h1 className="font-bold font-ortank text-3xl">
          {isNew ? "New article" : "Edit article"}
        </h1>
      </div>

      <div className="space-y-5 rounded-lg border border-neutral-300 bg-white p-6">
        <div>
          <label
            htmlFor="article-name"
            className="mb-1 block font-semibold text-black text-sm"
          >
            Article title
          </label>
          <input
            type="text"
            id="article-name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter article title"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

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
            onChange={(event) =>
              setIntroduction(event.target.value)
            }
            placeholder="Brief introduction to the article"
            rows={3}
            className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

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
            onChange={(event) =>
              setAuthorsInput(event.target.value)
            }
            placeholder="Author 1, Author 2, ..."
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

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
            onChange={(event) =>
              setKeywordsInput(event.target.value)
            }
            placeholder="keyword1, keyword2, ..."
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <FileDropZone
          label="Cover image"
          accept={BLOG_ARTICLE_IMAGE_ACCEPT}
          value={coverImage}
          onChange={setCoverImage}
          description="PNG, JPEG, WebP, or GIF. Shown at the top of the article."
          icon="image"
          studioId={studioId}
          folder="images"
        />
      </div>

      <div className="space-y-3 rounded-lg border border-neutral-300 bg-white p-6">
        <span className="block font-semibold text-black text-sm">
          Body
        </span>
        <RichTextEditor
          content={content}
          onChange={setContent}
          studioId={studioId}
          enableMedia
        />
      </div>

      {saveError && (
        <p className="font-whisper text-red-600 text-sm">
          {saveError}
        </p>
      )}

      <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3">
        <ButtonPreviewPage onClick={handlePreview} />
        <ButtonSaveChanges
          onClick={handlePublish}
          disabled={isSaving}
          label="Publish"
          loadingLabel="Publishing..."
        />
      </div>
    </div>
  );
}
