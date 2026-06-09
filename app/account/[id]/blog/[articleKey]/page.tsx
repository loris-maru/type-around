import BlogArticleEditorClient from "@/components/segments/account/blog/blog-article-editor-client";

type BlogArticlePageProps = {
  params: Promise<{ id: string; articleKey: string }>;
};

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { id, articleKey } = await params;

  return (
    <BlogArticleEditorClient
      articleKey={articleKey}
      studioId={id}
    />
  );
}
