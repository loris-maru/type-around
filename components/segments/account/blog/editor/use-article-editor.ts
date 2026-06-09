"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BLOG_ARTICLE_PREVIEW_STORAGE_KEY } from "@/constant/BLOG_ARTICLE_PREVIEW_STORAGE_KEY";
import { useStudio } from "@/hooks/use-studio";
import type { StudioBlogArticle } from "@/types/blog";
import { generateUUID } from "@/utils/generate-uuid";

type UseArticleEditorProps = {
  articleKey: string;
};

type UseArticleEditorReturn = {
  name: string;
  setName: (value: string) => void;
  introduction: string;
  setIntroduction: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  authorsInput: string;
  setAuthorsInput: (value: string) => void;
  keywordsInput: string;
  setKeywordsInput: (value: string) => void;
  coverImage: string;
  setCoverImage: (value: string) => void;
  isSaving: boolean;
  saveError: string | null;
  isNew: boolean;
  isMounted: boolean;
  isLoading: boolean;
  existingArticle: StudioBlogArticle | null;
  studioPageId: string | undefined;
  handlePreview: () => void;
  handlePublish: () => Promise<void>;
};

export function useArticleEditor({
  articleKey,
}: UseArticleEditorProps): UseArticleEditorReturn {
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
        .map((a) => a.trim())
        .filter(Boolean);
      const keywords = keywordsInput
        .split(",")
        .map((k) => k.trim())
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

  const handlePreview = useCallback(() => {
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
  }, [
    buildArticle,
    existingArticle?.published,
    studio?.id,
  ]);

  const handlePublish = useCallback(async () => {
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
  }, [
    buildArticle,
    isNew,
    router,
    studio,
    updateBlogArticles,
  ]);

  return {
    name,
    setName,
    introduction,
    setIntroduction,
    content,
    setContent,
    authorsInput,
    setAuthorsInput,
    keywordsInput,
    setKeywordsInput,
    coverImage,
    setCoverImage,
    isSaving,
    saveError,
    isNew,
    isMounted,
    isLoading,
    existingArticle,
    studioPageId: studio?.id,
    handlePreview,
    handlePublish,
  };
}
