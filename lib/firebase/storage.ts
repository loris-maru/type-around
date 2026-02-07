export type UploadFolder =
  | "fonts"
  | "images"
  | "documents"
  | "icons";

/**
 * Upload a file using signed URLs (secure, server-verified)
 * @param file - The file to upload
 * @param folder - The folder to upload to (fonts, images, documents, icons)
 * @param studioId - The studio ID for organizing files
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  folder: UploadFolder,
  studioId: string
): Promise<string> {
  // Get signed URL from API route (verifies authentication server-side)
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studioId,
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      folder,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || "Failed to get upload URL"
    );
  }

  const { uploadUrl, publicUrl } = await response.json();

  // Upload directly to Google Cloud Storage using signed URL
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type":
        file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(
      `Upload failed: ${uploadResponse.statusText}`
    );
  }

  return publicUrl;
}

/**
 * Upload multiple files to Firebase Storage
 * @param files - Array of files to upload
 * @param folder - The folder to upload to
 * @param studioId - The studio ID for organizing files
 * @returns Array of download URLs
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
 * @param fileUrl - The download URL of the file to delete
 */
export async function deleteFile(
  fileUrl: string
): Promise<void> {
  // TODO: Implement server-side deletion using signed URLs
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
