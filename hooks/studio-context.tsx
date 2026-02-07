"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import type { Studio, SocialMedia, StudioTypeface } from "@/types/studio";
import {
  getOrCreateStudio,
  getStudioById,
  updateStudioInformation,
  updateStudioSocialMedia,
  updateStudioPage,
  addStudioTypeface,
  removeStudioTypeface,
  updateStudioTypeface,
  updateStudio as updateStudioFirebase,
} from "@/lib/firebase/studios";

type StudioContextValue = {
  studio: Studio | null;
  isLoading: boolean;
  error: Error | null;
  updateInformation: (data: {
    name?: string;
    location?: string;
    foundedIn?: string;
    contactEmail?: string;
    designers?: { id: string; firstName: string; lastName: string }[];
    website?: string;
    thumbnail?: string;
    avatar?: string;
  }) => Promise<void>;
  updateSocialMedia: (socialMedia: SocialMedia[]) => Promise<void>;
  updateStudioPageSettings: (data: {
    headerFont?: string;
    heroCharacter?: string;
    gradient?: { from: string; to: string };
  }) => Promise<void>;
  addTypeface: (typeface: StudioTypeface) => Promise<void>;
  removeTypeface: (typefaceId: string) => Promise<void>;
  updateTypeface: (
    typefaceId: string,
    updates: Partial<StudioTypeface>
  ) => Promise<void>;
  updateStudio: (
    data: Partial<Omit<Studio, "id" | "ownerEmail">>
  ) => Promise<void>;
};

const StudioContext = createContext<StudioContextValue | null>(null);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const studioIdFromUrl = params?.id as string | undefined;

  // Fetch or create studio on mount
  useEffect(() => {
    async function fetchStudio() {
      if (studioIdFromUrl) {
        try {
          setIsLoading(true);
          const fetchedStudio = await getStudioById(studioIdFromUrl);
          setStudio(fetchedStudio);
          setError(null);
        } catch (err) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch studio")
          );
        } finally {
          setIsLoading(false);
        }
        return;
      }

      if (!isLoaded) return;

      if (!user) {
        setStudio(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const email = user.primaryEmailAddress?.emailAddress || "";
        const fetchedStudio = await getOrCreateStudio(user.id, email);
        setStudio(fetchedStudio);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch studio")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchStudio();
  }, [user, isLoaded, studioIdFromUrl]);

  const updateInformation = useCallback(
    async (data: {
      name?: string;
      location?: string;
      foundedIn?: string;
      contactEmail?: string;
      designers?: { id: string; firstName: string; lastName: string }[];
      website?: string;
      thumbnail?: string;
      avatar?: string;
    }) => {
      if (!studio) throw new Error("No studio loaded");
      await updateStudioInformation(studio.id, data);
      setStudio((prev) => (prev ? { ...prev, ...data } : null));
    },
    [studio]
  );

  const updateSocialMedia = useCallback(
    async (socialMedia: SocialMedia[]) => {
      if (!studio) throw new Error("No studio loaded");
      await updateStudioSocialMedia(studio.id, socialMedia);
      setStudio((prev) => (prev ? { ...prev, socialMedia } : null));
    },
    [studio]
  );

  const updateStudioPageSettings = useCallback(
    async (data: {
      headerFont?: string;
      heroCharacter?: string;
      gradient?: { from: string; to: string };
    }) => {
      if (!studio) throw new Error("No studio loaded");
      await updateStudioPage(studio.id, data);
      setStudio((prev) => (prev ? { ...prev, ...data } : null));
    },
    [studio]
  );

  const addTypeface = useCallback(
    async (typeface: StudioTypeface) => {
      if (!studio) throw new Error("No studio loaded");
      await addStudioTypeface(studio.id, typeface);
      setStudio((prev) =>
        prev
          ? { ...prev, typefaces: [...prev.typefaces, typeface] }
          : null
      );
    },
    [studio]
  );

  const removeTypeface = useCallback(
    async (typefaceId: string) => {
      if (!studio) throw new Error("No studio loaded");
      await removeStudioTypeface(studio.id, typefaceId);
      setStudio((prev) =>
        prev
          ? {
              ...prev,
              typefaces: prev.typefaces.filter((t) => t.id !== typefaceId),
            }
          : null
      );
    },
    [studio]
  );

  const updateTypeface = useCallback(
    async (typefaceId: string, updates: Partial<StudioTypeface>) => {
      if (!studio) throw new Error("No studio loaded");
      await updateStudioTypeface(studio.id, typefaceId, updates);
      setStudio((prev) =>
        prev
          ? {
              ...prev,
              typefaces: prev.typefaces.map((t) =>
                t.id === typefaceId ? { ...t, ...updates } : t
              ),
            }
          : null
      );
    },
    [studio]
  );

  const updateStudio = useCallback(
    async (data: Partial<Omit<Studio, "id" | "ownerEmail">>) => {
      if (!studio) throw new Error("No studio loaded");
      await updateStudioFirebase(studio.id, data);
      setStudio((prev) => (prev ? { ...prev, ...data } : null));
    },
    [studio]
  );

  const value = useMemo(
    () => ({
      studio,
      isLoading,
      error,
      updateInformation,
      updateSocialMedia,
      updateStudioPageSettings,
      addTypeface,
      removeTypeface,
      updateTypeface,
      updateStudio,
    }),
    [
      studio,
      isLoading,
      error,
      updateInformation,
      updateSocialMedia,
      updateStudioPageSettings,
      addTypeface,
      removeTypeface,
      updateTypeface,
      updateStudio,
    ]
  );

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  );
}

export function useStudioContext(): StudioContextValue {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error("useStudioContext must be used within a StudioProvider");
  }
  return context;
}
