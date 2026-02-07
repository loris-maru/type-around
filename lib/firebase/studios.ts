import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import type {
  SocialMedia,
  Studio,
  StudioTypeface,
} from "@/types/studio";
import {
  CreateStudioSchema,
  DEFAULT_STUDIO,
  StudioSchema,
  UpdateStudioInfoSchema,
  UpdateStudioPageSchema,
} from "@/types/studio";
import { db } from "./config";

const COLLECTION_NAME = "studios";

/**
 * Apply default values to fonts for backwards compatibility
 */
function normalizeFonts(fonts: unknown[]): unknown[] {
  return fonts.map((font) => {
    if (typeof font === "object" && font !== null) {
      const f = font as Record<string, unknown>;
      return {
        ...font,
        id: f.id ?? crypto.randomUUID(),
        styleName: f.styleName ?? f.name ?? "",
        width: f.width ?? 100,
        isItalic: f.isItalic ?? false,
        printPrice: f.printPrice ?? f.price ?? 0,
        webPrice: f.webPrice ?? 0,
        file: f.file ?? "",
      };
    }
    return font;
  });
}

/**
 * Apply default values to typefaces for backwards compatibility
 */
function normalizeTypefaces(
  typefaces: unknown[]
): unknown[] {
  return typefaces.map((typeface) => {
    if (typeof typeface === "object" && typeface !== null) {
      const t = typeface as Record<string, unknown>;
      return {
        ...typeface,
        status: t.status ?? "in progress",
        published: t.published ?? false,
        supportedLanguages: t.supportedLanguages ?? [],
        headerImage: t.headerImage ?? "",
        specimen: t.specimen ?? "",
        eula: t.eula ?? "",
        variableFontFile: t.variableFontFile ?? "",
        fonts: Array.isArray(t.fonts)
          ? normalizeFonts(t.fonts)
          : [],
      };
    }
    return typeface;
  });
}

/**
 * Get a studio by ID
 */
export async function getStudioById(
  id: string
): Promise<Studio | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const rawData = docSnap.data();
    // Normalize typefaces to add default values for new fields
    const data = {
      id: docSnap.id,
      ...rawData,
      typefaces: rawData.typefaces
        ? normalizeTypefaces(rawData.typefaces)
        : [],
    };
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
    const rawData = docData.data();
    // Normalize typefaces to add default values for new fields
    const data = {
      id: docData.id,
      ...rawData,
      typefaces: rawData.typefaces
        ? normalizeTypefaces(rawData.typefaces)
        : [],
    };
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
    designers?: {
      id: string;
      firstName: string;
      lastName: string;
    }[];
    website?: string;
    thumbnail?: string;
    avatar?: string;
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
    heroCharacter?: string;
    gradient?: { from: string; to: string };
    pageLayout?: {
      blockId: string;
      key: string;
      data?: Record<string, unknown>;
    }[];
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
 * Update a typeface in the studio
 */
export async function updateStudioTypeface(
  studioId: string,
  typefaceId: string,
  updates: Partial<StudioTypeface>
): Promise<void> {
  const studio = await getStudioById(studioId);
  if (!studio) throw new Error("Studio not found");

  const updatedTypefaces = studio.typefaces.map((t) =>
    t.id === typefaceId ? { ...t, ...updates } : t
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

/**
 * Update studio Stripe account ID
 */
export async function updateStudioStripeAccountId(
  studioId: string,
  stripeAccountId: string
): Promise<void> {
  await updateStudio(studioId, { stripeAccountId });
}

/**
 * Get all studios where user is owner or member
 */
export async function getStudiosByUserEmail(
  email: string
): Promise<Studio[]> {
  const studios: Studio[] = [];

  // Query for studios where user is owner
  const ownerQuery = query(
    collection(db, COLLECTION_NAME),
    where("ownerEmail", "==", email)
  );
  const ownerSnapshot = await getDocs(ownerQuery);

  for (const docData of ownerSnapshot.docs) {
    const rawData = docData.data();
    const data = {
      id: docData.id,
      ...rawData,
      typefaces: rawData.typefaces
        ? normalizeTypefaces(rawData.typefaces)
        : [],
    };
    const result = StudioSchema.safeParse(data);
    if (result.success) {
      studios.push(result.data);
    } else {
      studios.push(data as Studio);
    }
  }

  // Query for all studios and filter for membership
  // (Firestore doesn't support array-contains on nested objects directly)
  const allStudiosQuery = query(
    collection(db, COLLECTION_NAME)
  );
  const allSnapshot = await getDocs(allStudiosQuery);

  for (const docData of allSnapshot.docs) {
    // Skip if already added as owner
    if (studios.some((s) => s.id === docData.id)) continue;

    const rawData = docData.data();
    const members = rawData.members || [];

    // Check if user is a member
    const isMember = members.some(
      (m: { email?: string }) => m.email === email
    );

    if (isMember) {
      const data = {
        id: docData.id,
        ...rawData,
        typefaces: rawData.typefaces
          ? normalizeTypefaces(rawData.typefaces)
          : [],
      };
      const result = StudioSchema.safeParse(data);
      if (result.success) {
        studios.push(result.data);
      } else {
        studios.push(data as Studio);
      }
    }
  }

  return studios;
}

/**
 * Get all published typefaces from all studios
 */
export async function getAllPublishedTypefaces(): Promise<
  Array<
    StudioTypeface & {
      studioName: string;
      studioSlug: string;
    }
  >
> {
  const allTypefaces: Array<
    StudioTypeface & {
      studioName: string;
      studioSlug: string;
    }
  > = [];

  const allStudiosQuery = query(
    collection(db, COLLECTION_NAME)
  );
  const snapshot = await getDocs(allStudiosQuery);

  for (const docData of snapshot.docs) {
    const rawData = docData.data();
    const studioName = rawData.name || "Unknown Studio";
    const studioSlug = studioName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const typefaces = rawData.typefaces
      ? normalizeTypefaces(rawData.typefaces)
      : [];

    for (const typeface of typefaces) {
      const t = typeface as StudioTypeface;
      // Only include published typefaces
      if (t.published) {
        allTypefaces.push({
          ...t,
          studioName,
          studioSlug,
        });
      }
    }
  }

  return allTypefaces;
}
