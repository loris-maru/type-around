import BlogArticleEditorPage from "@/components/segments/account/blog/blog-article-editor-page";
import { ErrorBoundary } from "@/components/global/error-boundary";

type BlogArticlePageProps = {
  params: Promise<{ id: string; articleKey: string }>;
};

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { id, articleKey } = await params;

  return (
    <ErrorBoundary>
      <BlogArticleEditorPage
        articleKey={articleKey}
        studioId={id}
      />
    </ErrorBoundary>
  );
}
