/**
 * Ensures HTML content is wrapped in paragraph tags for TipTap editor.
 * Returns "<p></p>" for empty content, or wraps bare text in <p>.
 */
export function ensureParagraphWrap(html: string): string {
  if (!html || html.trim() === "") return "<p></p>";
  const trimmed = html.trim();
  if (
    trimmed.startsWith("<p") ||
    trimmed.startsWith("<div")
  )
    return html;
  return `<p>${html}</p>`;
}
