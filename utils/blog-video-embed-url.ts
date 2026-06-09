export function getBlogVideoEmbedUrl(
  url: string
):
  | { type: "embed"; src: string }
  | { type: "file"; src: string }
  | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);

    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtube-nocookie.com")
    ) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return {
          type: "embed",
          src: `https://www.youtube.com/embed/${videoId}`,
        };
      }
    }

    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname
        .split("/")
        .filter(Boolean)[0];
      if (videoId) {
        return {
          type: "embed",
          src: `https://www.youtube.com/embed/${videoId}`,
        };
      }
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const videoId = parsed.pathname
        .split("/")
        .filter(Boolean)
        .pop();
      if (videoId) {
        return {
          type: "embed",
          src: `https://player.vimeo.com/video/${videoId}`,
        };
      }
    }

    if (
      /\.(mp4|webm|ogg|mov)(\?|$)/i.test(parsed.pathname)
    ) {
      return { type: "file", src: trimmed };
    }
  } catch {
    return null;
  }

  return null;
}
