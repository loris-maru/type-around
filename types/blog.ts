import { z } from "zod";

export const StudioBlogArticleSchema = z.object({
  key: z.string(),
  name: z.string().default(""),
  introduction: z.string().default(""),
  content: z.string().default(""),
  coverImage: z.string().default(""),
  authors: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  createdAt: z.string().default(""),
  updatedAt: z.string().default(""),
});

export type StudioBlogArticle = z.infer<
  typeof StudioBlogArticleSchema
>;

export type BlogArticleDraft = Omit<
  StudioBlogArticle,
  "createdAt" | "updatedAt" | "published"
> & {
  published?: boolean;
};

export type PublicBlogArticle = {
  key: string;
  name: string;
  introduction: string;
  studioName: string;
  studioSlug: string;
  updatedAt: string;
};
