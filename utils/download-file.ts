/**
 * Download a file by fetching it as a blob first.
 * This bypasses the browser's cross-origin restriction on the
 * `download` attribute, which would otherwise open the file
 * (e.g. in Google Cloud Storage's viewer) instead of downloading it.
 */
export async function downloadFile(
  url: string,
  filename: string
): Promise<void> {
  const response = await fetch(url);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(objectUrl);
}
