import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./config";
import {
  Studio,
  StudioSchema,
  CreateStudioSchema,
  UpdateStudioInfoSchema,
  UpdateStudioPageSchema,
  DEFAULT_STUDIO,
  StudioTypeface,
  SocialMedia,
} from "@/types/studio";

const COLLECTION_NAME = "studios";

/**
 * Get a studio by ID
 */
export async function getStudioById(
  id: string
): Promise<Studio | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = { id: docSnap.id, ...docSnap.data() };
    // Validate with Zod
    const result = StudioSchema.safeParse(data);
    if (result.success) {
      return result.data;
    }
    console.error("Invalid studio data:", result.error);
    return data as Studio; // Return anyway for backwards compatibility
  }

  return null;
}

/**
 * Get a studio by owner email
 */
export async function getStudioByEmail(
  email: string
): Promise<Studio | null> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("ownerEmail", "==", email)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docData = querySnapshot.docs[0];
    const data = { id: docData.id, ...docData.data() };
    const result = StudioSchema.safeParse(data);
    if (result.success) {
      return result.data;
    }
    return data as Studio;
  }

  return null;
}

/**
 * Create a new studio
 */
export async function createStudio(
  id: string,
  ownerEmail: string,
  data?: Partial<Studio>
): Promise<Studio> {
  const studioData = {
    ...DEFAULT_STUDIO,
    ownerEmail,
    ...data,
  };

  // Validate with Zod
  const result = CreateStudioSchema.safeParse(studioData);
  if (!result.success) {
    throw new Error(
      `Invalid studio data: ${result.error.message}`
    );
  }

  await setDoc(doc(db, COLLECTION_NAME, id), result.data);

  return { id, ...result.data };
}

/**
 * Update an existing studio
 */
export async function updateStudio(
  id: string,
  data: Partial<Omit<Studio, "id" | "ownerEmail">>
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
}

/**
 * Update studio information (name, location, etc.)
 */
export async function updateStudioInformation(
  id: string,
  data: {
    name?: string;
    location?: string;
    foundedIn?: string;
    contactEmail?: string;
    designers?: { firstName: string; lastName: string }[];
    website?: string;
  }
): Promise<void> {
  // Validate with Zod
  const result = UpdateStudioInfoSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Invalid studio info: ${result.error.message}`
    );
  }

  await updateStudio(id, result.data);
}

/**
 * Update studio social media
 */
export async function updateStudioSocialMedia(
  id: string,
  socialMedia: SocialMedia[]
): Promise<void> {
  await updateStudio(id, { socialMedia });
}

/**
 * Update studio page settings
 */
export async function updateStudioPage(
  id: string,
  data: {
    headerFont?: string;
    gradient?: { from: string; to: string };
  }
): Promise<void> {
  // Validate with Zod
  const result = UpdateStudioPageSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Invalid studio page data: ${result.error.message}`
    );
  }

  await updateStudio(id, result.data);
}

/**
 * Add a typeface to the studio
 */
export async function addStudioTypeface(
  id: string,
  typeface: StudioTypeface
): Promise<void> {
  const studio = await getStudioById(id);
  if (!studio) throw new Error("Studio not found");

  const updatedTypefaces = [...studio.typefaces, typeface];
  await updateStudio(id, { typefaces: updatedTypefaces });
}

/**
 * Remove a typeface from the studio
 */
export async function removeStudioTypeface(
  studioId: string,
  typefaceId: string
): Promise<void> {
  const studio = await getStudioById(studioId);
  if (!studio) throw new Error("Studio not found");

  const updatedTypefaces = studio.typefaces.filter(
    (t) => t.id !== typefaceId
  );
  await updateStudio(studioId, {
    typefaces: updatedTypefaces,
  });
}

/**
 * Get or create studio for a user
 */
export async function getOrCreateStudio(
  userId: string,
  email: string
): Promise<Studio> {
  let studio = await getStudioById(userId);

  if (!studio) {
    studio = await createStudio(userId, email);
  }

  return studio;
}
