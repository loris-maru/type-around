"use client";

import dynamic from "next/dynamic";

const BlogArticleEditorPage = dynamic(
  () =>
    import("@/components/segments/account/blog/blog-article-editor-page"),
  {
    ssr: false,
    loading: () => (
      <div className="flex w-full items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
      </div>
    ),
  }
);

type BlogArticleEditorClientProps = {
  articleKey: string;
  studioId: string;
};

export default function BlogArticleEditorClient({
  articleKey,
  studioId,
}: BlogArticleEditorClientProps) {
  return (
    <BlogArticleEditorPage
      articleKey={articleKey}
      studioId={studioId}
    />
  );
}
