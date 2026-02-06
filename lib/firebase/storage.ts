import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./config";
import { generateUUID } from "@/utils/generate-uuid";

export type UploadFolder =
  | "fonts"
  | "images"
  | "documents"
  | "icons";

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param folder - The folder to upload to (fonts, images, documents, icons)
 * @param studioId - The studio ID for organizing files
 * @returns The download URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  folder: UploadFolder,
  studioId: string
): Promise<string> {
  // Generate unique filename to avoid collisions
  const fileExtension = file.name.split(".").pop();
  const uniqueFileName = `${generateUUID()}.${fileExtension}`;
  const filePath = `studios/${studioId}/${folder}/${uniqueFileName}`;

  const storageRef = ref(storage, filePath);

  // Upload the file
  const snapshot = await uploadBytes(storageRef, file);

  // Get the download URL
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
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
 * Delete a file from Firebase Storage by URL
 * @param fileUrl - The download URL of the file to delete
 */
export async function deleteFile(
  fileUrl: string
): Promise<void> {
  try {
    // Extract the path from the URL
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
  } catch (error) {
    // File might not exist, ignore the error
    console.warn("Failed to delete file:", error);
  }
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
