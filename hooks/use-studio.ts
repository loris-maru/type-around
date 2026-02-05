"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Studio,
  SocialMedia,
  StudioTypeface,
} from "@/types/studio";
import {
  getOrCreateStudio,
  updateStudioInformation,
  updateStudioSocialMedia,
  updateStudioPage,
  addStudioTypeface,
  removeStudioTypeface,
} from "@/lib/firebase/studios";

export function useStudio() {
  const { user, isLoaded } = useUser();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch or create studio on mount
  useEffect(() => {
    async function fetchStudio() {
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
  }, [user, isLoaded]);

  // Update studio information
  const updateInformation = useCallback(
    async (data: {
      name?: string;
      location?: string;
      foundedIn?: string;
      contactEmail?: string;
      designers?: { firstName: string; lastName: string }[];
      website?: string;
    }) => {
      if (!studio) throw new Error("No studio loaded");

      try {
        await updateStudioInformation(studio.id, data);
        setStudio((prev) =>
          prev ? { ...prev, ...data } : null
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to update studio")
        );
        throw err;
      }
    },
    [studio]
  );

  // Update social media
  const updateSocialMedia = useCallback(
    async (socialMedia: SocialMedia[]) => {
      if (!studio) throw new Error("No studio loaded");

      try {
        await updateStudioSocialMedia(
          studio.id,
          socialMedia
        );
        setStudio((prev) =>
          prev ? { ...prev, socialMedia } : null
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to update social media")
        );
        throw err;
      }
    },
    [studio]
  );

  // Update studio page settings
  const updateStudioPageSettings = useCallback(
    async (data: {
      headerFont?: string;
      gradient?: { from: string; to: string };
    }) => {
      if (!studio) throw new Error("No studio loaded");

      try {
        await updateStudioPage(studio.id, data);
        setStudio((prev) =>
          prev ? { ...prev, ...data } : null
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to update studio page")
        );
        throw err;
      }
    },
    [studio]
  );

  // Add a typeface to the studio
  const addTypeface = useCallback(
    async (typeface: StudioTypeface) => {
      if (!studio) throw new Error("No studio loaded");

      try {
        await addStudioTypeface(studio.id, typeface);
        setStudio((prev) =>
          prev
            ? {
                ...prev,
                typefaces: [...prev.typefaces, typeface],
              }
            : null
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to add typeface")
        );
        throw err;
      }
    },
    [studio]
  );

  // Remove a typeface from the studio
  const removeTypeface = useCallback(
    async (typefaceId: string) => {
      if (!studio) throw new Error("No studio loaded");

      try {
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
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to remove typeface")
        );
        throw err;
      }
    },
    [studio]
  );

  return {
    studio,
    isLoading,
    error,
    updateInformation,
    updateSocialMedia,
    updateStudioPageSettings,
    addTypeface,
    removeTypeface,
  };
}
