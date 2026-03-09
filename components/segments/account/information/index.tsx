"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAutosave } from "@/hooks/use-autosave";
import { useStudio } from "@/hooks/use-studio";
import ChangesSavedPill from "../changes-saved-pill";
import AccountForm from "../form";
import SaveErrorPill from "../save-error-pill";
import ACCOUNT_FORM from "./ACCOUNT_FORM";
import SOCIAL_FORM from "./SOCIAL_FORM";
import StudioImages from "./studio-images";

const STORAGE_KEY_PREFIX = "account-info-";

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
  const [isInitialized, setIsInitialized] = useState(false);
  const studioValuesRef = useRef(studioValues);
  const socialValuesRef = useRef(socialValues);

  useEffect(() => {
    studioValuesRef.current = studioValues;
    socialValuesRef.current = socialValues;
  }, [studioValues, socialValues]);

  const studioInitialValues = useMemo((): Record<
    string,
    string
  > => {
    if (!studio) return {} as Record<string, string>;
    return {
      name: studio.name || "",
      hangeulName: studio.hangeulName || "",
      location: studio.location || "",
      foundedIn: studio.foundedIn || "",
      email: studio.contactEmail || "",
      website: studio.website || "",
      description: studio.description || "",
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

  // Initialize: restore from localStorage or use studio data
  useEffect(() => {
    if (
      !studio?.id ||
      Object.keys(studioInitialValues).length === 0
    )
      return;

    const storageKey = `${STORAGE_KEY_PREFIX}${studio.id}`;

    const applyState = () => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as {
            studio: Record<string, string>;
            social: Record<string, string>;
          };
          setStudioValues({
            ...studioInitialValues,
            ...parsed?.studio,
          });
          setSocialValues({
            ...socialInitialValues,
            ...parsed?.social,
          });
        } else {
          setStudioValues(studioInitialValues);
          setSocialValues(socialInitialValues);
        }
      } catch {
        setStudioValues(studioInitialValues);
        setSocialValues(socialInitialValues);
      }
      setIsInitialized(true);
    };

    queueMicrotask(applyState);
  }, [
    studio?.id,
    studioInitialValues,
    socialInitialValues,
  ]);

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

  const persistToStorage = useCallback(
    (
      studioData: Record<string, string>,
      social: Record<string, string>
    ) => {
      if (!studio?.id) return;
      try {
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${studio.id}`,
          JSON.stringify({ studio: studioData, social })
        );
      } catch {
        // Ignore quota errors
      }
    },
    [studio]
  );

  const handleStudioChange = useCallback(
    (values: Record<string, string>) => {
      persistToStorage(values, socialValuesRef.current);
      setStudioValues(values);
    },
    [persistToStorage]
  );

  const handleSocialChange = useCallback(
    (values: Record<string, string>) => {
      persistToStorage(studioValuesRef.current, values);
      setSocialValues(values);
    },
    [persistToStorage]
  );

  const saveToFirebase = useCallback(
    async (data: {
      studio: Record<string, string>;
      social: Record<string, string>;
    }) => {
      await updateInformation({
        name: data.studio.name,
        hangeulName: data.studio.hangeulName,
        location: data.studio.location,
        foundedIn: data.studio.foundedIn,
        contactEmail: data.studio.email,
        website: data.studio.website,
        description: data.studio.description,
      });

      const socialMedia = [
        {
          name: "instagram",
          url: data.social.instagram || "",
        },
        { name: "twitter", url: data.social.x || "" },
        {
          name: "linkedin",
          url: data.social.linkedin || "",
        },
        {
          name: "behance",
          url: data.social.behance || "",
        },
      ].filter((s) => s.url);

      await updateSocialMedia(socialMedia);
    },
    [updateInformation, updateSocialMedia]
  );

  const combinedData = useMemo(
    () => ({ studio: studioValues, social: socialValues }),
    [studioValues, socialValues]
  );

  const { showSaved, saveError, retry } = useAutosave({
    storageKey: studio?.id
      ? `${STORAGE_KEY_PREFIX}${studio.id}`
      : "",
    data: combinedData,
    saveFn: saveToFirebase,
    enabled: hasChanges && !!studio?.id,
  });

  return (
    <div className="relative flex w-full flex-col gap-y-12">
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

      <ChangesSavedPill show={showSaved} />
      {saveError && (
        <SaveErrorPill
          message={saveError}
          onRetry={retry}
        />
      )}
    </div>
  );
}
