import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import type {
  FontInUseSubmission,
  StudioSummary,
  SubmissionStatus,
} from "@/types/my-account";
import { db } from "./config";

const COLLECTION_NAME = "submissions";
const STUDIOS_COLLECTION = "studios";

/**
 * Create a new font-in-use submission
 */
export async function createSubmission(
  data: Omit<FontInUseSubmission, "id">
): Promise<FontInUseSubmission> {
  const docRef = await addDoc(
    collection(db, COLLECTION_NAME),
    data
  );
  return { id: docRef.id, ...data };
}

/**
 * Get all submissions for a specific studio
 */
export async function getSubmissionsByStudio(
  studioId: string
): Promise<FontInUseSubmission[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("studioId", "==", studioId),
    where("status", "==", "pending")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<FontInUseSubmission, "id">),
  }));
}

/**
 * Get all submissions by a specific user
 */
export async function getSubmissionsByUser(
  userId: string
): Promise<FontInUseSubmission[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("submittedByUserId", "==", userId)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<FontInUseSubmission, "id">),
  }));
}

/**
 * Update submission status (accept/reject)
 */
export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status });
}

/**
 * Delete a submission
 */
export async function deleteSubmission(
  id: string
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * Get all studios (summary with id, name, typefaces)
 * Used to populate the studio dropdown in the submission modal
 */
export async function getAllStudios(): Promise<
  StudioSummary[]
> {
  const snapshot = await getDocs(
    collection(db, STUDIOS_COLLECTION)
  );

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    const typefaces = Array.isArray(data.typefaces)
      ? data.typefaces.map(
          (t: {
            id: string;
            name: string;
            slug: string;
          }) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
          })
        )
      : [];

    return {
      id: docSnap.id,
      name: data.name || "Unknown Studio",
      typefaces,
    };
  });
}
