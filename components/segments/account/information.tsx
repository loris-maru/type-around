"use client";

import {
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useStudio } from "@/hooks/use-studio";
import { RiSaveLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react";
import AccountForm from "./form";
import ACCOUNT_FORM from "./information/ACCOUNT_FORM";
import SOCIAL_FORM from "./information/SOCIAL_FORM";
import StudioImages from "./information/studio-images";

export default function AccountInformation() {
  const {
    studio,
    isLoading,
    updateInformation,
    updateSocialMedia,
  } = useStudio();

  const [studioValues, setStudioValues] = useState<
    Record<string, string>
  >({});
  const [socialValues, setSocialValues] = useState<
    Record<string, string>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Map studio data to initial form values
  const studioInitialValues = useMemo((): Record<
    string,
    string
  > => {
    if (!studio) return {} as Record<string, string>;
    return {
      name: studio.name || "",
      location: studio.location || "",
      foundedIn: studio.foundedIn || "",
      email: studio.contactEmail || "",
      website: studio.website || "",
    };
  }, [studio]);

  const socialInitialValues = useMemo((): Record<
    string,
    string
  > => {
    if (!studio) return {} as Record<string, string>;
    return {
      instagram:
        studio.socialMedia.find(
          (s) => s.name === "instagram"
        )?.url || "",
      x:
        studio.socialMedia.find((s) => s.name === "twitter")
          ?.url || "",
      linkedin:
        studio.socialMedia.find(
          (s) => s.name === "linkedin"
        )?.url || "",
      behance:
        studio.socialMedia.find((s) => s.name === "behance")
          ?.url || "",
    };
  }, [studio]);

  // Initialize form values when studio loads
  useEffect(() => {
    if (studio && !isInitialized) {
      setStudioValues(studioInitialValues);
      setSocialValues(socialInitialValues);
      setIsInitialized(true);
    }
  }, [
    studio,
    studioInitialValues,
    socialInitialValues,
    isInitialized,
  ]);

  // Reset to initial values after save (when studio updates)
  useEffect(() => {
    if (studio && isInitialized && !isSaving) {
      setStudioValues(studioInitialValues);
      setSocialValues(socialInitialValues);
    }
  }, [studio]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    if (!isInitialized) return false;

    const studioChanged = Object.keys(studioValues).some(
      (key) =>
        studioValues[key] !== studioInitialValues[key]
    );

    const socialChanged = Object.keys(socialValues).some(
      (key) =>
        socialValues[key] !== socialInitialValues[key]
    );

    return studioChanged || socialChanged;
  }, [
    studioValues,
    socialValues,
    studioInitialValues,
    socialInitialValues,
    isInitialized,
  ]);

  const handleStudioChange = useCallback(
    (values: Record<string, string>) => {
      setStudioValues(values);
    },
    []
  );

  const handleSocialChange = useCallback(
    (values: Record<string, string>) => {
      setSocialValues(values);
    },
    []
  );

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Save studio information
      await updateInformation({
        name: studioValues.name,
        location: studioValues.location,
        foundedIn: studioValues.foundedIn,
        contactEmail: studioValues.email,
        website: studioValues.website,
      });

      // Save social media
      const socialMedia = [
        {
          name: "instagram",
          url: socialValues.instagram || "",
        },
        { name: "twitter", url: socialValues.x || "" },
        {
          name: "linkedin",
          url: socialValues.linkedin || "",
        },
        {
          name: "behance",
          url: socialValues.behance || "",
        },
      ].filter((s) => s.url);

      await updateSocialMedia(socialMedia);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative w-full flex flex-col gap-y-12">
      <AccountForm
        title="Studio Information"
        FORM_FIELDS={ACCOUNT_FORM}
        initialValues={studioValues}
        onChange={handleStudioChange}
        isLoading={isLoading}
      />
      <StudioImages />
      <AccountForm
        title="Social Media"
        FORM_FIELDS={SOCIAL_FORM}
        initialValues={socialValues}
        onChange={handleSocialChange}
        isLoading={isLoading}
      />

      {/* Global Save Button with spring animation */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              <RiSaveLine className="w-5 h-5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
