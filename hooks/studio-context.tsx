"use client";

import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addStudioSpecimen,
  addStudioTypeface,
  getOrCreateStudio,
  getStudioById,
  removeStudioTypeface,
  updateStudio as updateStudioFirebase,
  updateStudioInformation,
  updateStudioPage,
  updateStudioSocialMedia,
  updateStudioSpecimen,
  updateStudioTypeface,
} from "@/lib/firebase/studios";
import type { LayoutItem } from "@/types/layout";
import type {
  SocialMedia,
  Studio,
  StudioContextValue,
  StudioSpecimen,
  StudioTypeface,
} from "@/types/studio";

const StudioContext =
  createContext<StudioContextValue | null>(null);

export function StudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
          const fetchedStudio =
            await getStudioById(studioIdFromUrl);
          setStudio(fetchedStudio);
          setError(null);
        } catch (err) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch studio")
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
        const email =
          user.primaryEmailAddress?.emailAddress || "";
        const fetchedStudio = await getOrCreateStudio(
          user.id,
          email
        );
        setStudio(fetchedStudio);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch studio")
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
      hangeulName?: string;
      location?: string;
      foundedIn?: string;
      contactEmail?: string;
      description?: string;
      designers?: {
        id?: string;
        firstName: string;
        lastName: string;
        email?: string;
        biography?: string;
        avatar?: string;
        website?: string;
        socialMedia?: { name: string; url: string }[];
      }[];
      website?: string;
      thumbnail?: string;
      avatar?: string;
    }) => {
      if (!studio) throw new Error("No studio loaded");
      await updateStudioInformation(studio.id, data);

      // Create/update Mailchimp segment when studio name is set or changed
      if (data.name && data.name !== studio.name) {
        fetch("/api/newsletter/create-studio-segment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studioName: data.name }),
        }).catch(() => {
          // Silently fail — Mailchimp sync is non-critical
        });
      }

      setStudio((prev) =>
        prev ? ({ ...prev, ...data } as typeof prev) : null
      );
    },
    [studio]
  );

  const updateSocialMedia = useCallback(
    async (socialMedia: SocialMedia[]) => {
      if (!studio) throw new Error("No studio loaded");
      await updateStudioSocialMedia(studio.id, socialMedia);
      setStudio((prev) =>
        prev ? { ...prev, socialMedia } : null
      );
    },
    [studio]
  );

  const updateStudioPageSettings = useCallback(
    async (data: {
      headerFont?: string;
      textFont?: string;
      heroCharacter?: string;
      gradient?: { from: string; to: string };
      pageLayout?: LayoutItem[];
    }) => {
      if (!studio) throw new Error("No studio loaded");
      await updateStudioPage(studio.id, data);
      setStudio((prev) =>
        prev ? { ...prev, ...data } : null
      );
    },
    [studio]
  );

  const addTypeface = useCallback(
    async (typeface: StudioTypeface) => {
      if (!studio) throw new Error("No studio loaded");
      await addStudioTypeface(studio.id, typeface);
      setStudio((prev) =>
        prev
          ? {
              ...prev,
              typefaces: [...prev.typefaces, typeface],
            }
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
              typefaces: prev.typefaces.filter(
                (t) => t.id !== typefaceId
              ),
            }
          : null
      );
    },
    [studio]
  );

  const updateTypeface = useCallback(
    async (
      typefaceId: string,
      updates: Partial<StudioTypeface>
    ) => {
      if (!studio) throw new Error("No studio loaded");
      await updateStudioTypeface(
        studio.id,
        typefaceId,
        updates
      );
      setStudio((prev) =>
        prev
          ? {
              ...prev,
              typefaces: prev.typefaces.map((t) =>
                t.id === typefaceId
                  ? { ...t, ...updates }
                  : t
              ),
            }
          : null
      );
    },
    [studio]
  );

  const updateStudio = useCallback(
    async (
      data: Partial<Omit<Studio, "id" | "ownerEmail">>
    ) => {
      if (!studio) throw new Error("No studio loaded");
      await updateStudioFirebase(studio.id, data);
      setStudio((prev) =>
        prev ? { ...prev, ...data } : null
      );
    },
    [studio]
  );

  const addSpecimen = useCallback(
    async (specimen: StudioSpecimen) => {
      if (!studio) throw new Error("No studio loaded");
      await addStudioSpecimen(studio.id, specimen);
      setStudio((prev) =>
        prev
          ? {
              ...prev,
              specimens: [
                ...(prev.specimens ?? []),
                specimen,
              ],
            }
          : null
      );
    },
    [studio]
  );

  const updateSpecimen = useCallback(
    async (
      specimenId: string,
      updates: Partial<
        Pick<
          StudioSpecimen,
          "name" | "format" | "orientation" | "pages"
        >
      >
    ) => {
      if (!studio) throw new Error("No studio loaded");
      await updateStudioSpecimen(
        studio.id,
        specimenId,
        updates
      );
      setStudio((prev) =>
        prev
          ? {
              ...prev,
              specimens: (prev.specimens ?? []).map((s) =>
                s.id === specimenId
                  ? { ...s, ...updates }
                  : s
              ),
            }
          : null
      );
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
      addSpecimen,
      updateSpecimen,
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
      addSpecimen,
      updateSpecimen,
    ]
  );

  return (
    <StudioContext.Provider value={value}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudioContext(): StudioContextValue {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error(
      "useStudioContext must be used within a StudioProvider"
    );
  }
  return context;
}
