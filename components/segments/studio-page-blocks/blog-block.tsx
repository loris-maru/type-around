import StudioBlogBlock from "@/components/segments/studio/blog-block";
import type {
  BlogArticle,
  BlogBlockData,
} from "@/types/layout";
import type { Studio } from "@/types/studio";

export default function StudioPageBlogBlock({
  studio,
  data,
}: {
  studio: Studio;
  data?: BlogBlockData;
}) {
  const allPublished: BlogArticle[] = (
    studio.blogArticles ?? []
  )
    .filter((article) => article.published)
    .map((article) => ({
      key: article.key,
      name: article.name,
      introduction: article.introduction,
      content: article.content,
      authors: article.authors,
      keywords: article.keywords,
    }));

  const selectedKeys = data?.articleKeys;
  const publishedArticles =
    selectedKeys && selectedKeys.length > 0
      ? allPublished.filter((a) =>
          selectedKeys.includes(a.key)
        )
      : allPublished;

  const legacyArticles = data?.articles ?? [];
  const articles =
    publishedArticles.length > 0
      ? publishedArticles
      : legacyArticles;

  return (
    <StudioBlogBlock
      data={{
        title: data?.title ?? "",
        articles,
      }}
    />
  );
}
