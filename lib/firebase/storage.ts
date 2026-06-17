export type UploadFolder =
  | "fonts"
  | "images"
  | "documents"
  | "icons"
  | "layout"
  | "feedback";

/**
 * Upload a file via the server-side API route which writes directly to GCS
 * and makes the object publicly readable. No browser-to-GCS request is made,
 * so CORS is never an issue.
 */
export async function uploadFile(
  file: File,
  folder: UploadFolder,
  studioId: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("studioId", studioId);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({}));
    throw new Error(errorData.error || "Upload failed");
  }

  const { publicUrl } = await response.json();
  return publicUrl;
}

/**
 * Upload multiple files to Firebase Storage
 */
export async function uploadMultipleFiles(
  files: File[],
  folder: UploadFolder,
  studioId: string
): Promise<string[]> {
  const uploadPromises = files.map((file) =>
    uploadFile(file, folder, studioId)
  );
  return Promise.all(uploadPromises);
}

/**
 * Delete a file from storage by URL
 * Note: File deletion requires server-side implementation
 */
export async function deleteFile(
  fileUrl: string
): Promise<void> {
  console.warn(
    "File deletion not yet implemented for:",
    fileUrl
  );
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

/**
 * Check if a URL is a Firebase Storage URL
 */
export function isStorageUrl(url: string): boolean {
  return (
    url.includes("firebasestorage.googleapis.com") ||
    url.includes("storage.googleapis.com")
  );
}
