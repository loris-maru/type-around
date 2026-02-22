import StudioBlogBlock from "@/components/segments/studio/blog-block";
import type { BlogBlockData } from "@/types/layout";

export default function StudioPageBlogBlock({
  data,
}: {
  data: BlogBlockData | undefined;
}) {
  if (!data) return null;
  return <StudioBlogBlock data={data} />;
}
