import MarkdownIt from "markdown-it";
import { cn } from "@/utils/class-names";

const md = new MarkdownIt({ html: true });

/**
 * Renders rich text content (Markdown or HTML from TiptapEditor) or plain text.
 * Use for displaying studio/typeface descriptions that support bold, alignment, font-size, line-height.
 */
export default function RichTextContent({
  content,
  className,
  ...props
}: {
  content: string;
  className?: string;
} & React.ComponentPropsWithoutRef<"div">) {
  if (!content?.trim()) return null;

  // If it's HTML (starts with tag), render as HTML
  // Otherwise treat as markdown (supports HTML inline via markdown-it html: true)
  const isHtml = content.trim().startsWith("<");
  const html = isHtml ? content : md.render(content);

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none [&_p:last-child]:mb-0 [&_p]:mb-2 [&_p]:text-[22px] [&_strong]:font-bold",
        className
      )}
      /* biome-ignore lint/security/noDangerouslySetInnerHtml: rich text from editor, markdown rendered server-side */
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
}
