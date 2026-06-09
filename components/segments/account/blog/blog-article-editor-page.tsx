"use client";

import Link from "next/link";
import { ArticleBodyEditor } from "@/components/segments/account/blog/editor/article-body-editor";
import { ArticleEditorActions } from "@/components/segments/account/blog/editor/article-editor-actions";
import { ArticleEditorHeader } from "@/components/segments/account/blog/editor/article-editor-header";
import { ArticleMetadataForm } from "@/components/segments/account/blog/editor/article-metadata-form";
import { useArticleEditor } from "@/components/segments/account/blog/editor/use-article-editor";

type BlogArticleEditorPageProps = {
  articleKey: string;
  studioId: string;
};

export default function BlogArticleEditorPage({
  articleKey,
  studioId,
}: BlogArticleEditorPageProps) {
  const {
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
    studioPageId,
    handlePreview,
    handlePublish,
  } = useArticleEditor({ articleKey });

  if (!isMounted || isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
      </div>
    );
  }

  if (!isNew && studioPageId && !existingArticle) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="font-whisper text-neutral-500">
          Article not found.
        </p>
        <Link
          href={`/account/${studioPageId}?nav=articles`}
          className="font-medium font-whisper text-black underline"
        >
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col gap-8 pb-28">
      <ArticleEditorHeader
        studioId={studioId}
        isNew={isNew}
      />

      <ArticleMetadataForm
        name={name}
        onNameChange={setName}
        introduction={introduction}
        onIntroductionChange={setIntroduction}
        authorsInput={authorsInput}
        onAuthorsChange={setAuthorsInput}
        keywordsInput={keywordsInput}
        onKeywordsChange={setKeywordsInput}
        coverImage={coverImage}
        onCoverImageChange={setCoverImage}
        studioId={studioId}
      />

      <ArticleBodyEditor
        content={content}
        onChange={setContent}
        studioId={studioId}
      />

      <ArticleEditorActions
        onPreview={handlePreview}
        onPublish={handlePublish}
        isSaving={isSaving}
        saveError={saveError}
      />
    </div>
  );
}
