"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ButtonPreviewPage } from "@/components/molecules/buttons";
import { DEFAULT_PAGE_LAYOUT } from "@/constant/DEFAULT_PAGE_LAYOUT";
import { useAutosave } from "@/hooks/use-autosave";
import { useStudio } from "@/hooks/use-studio";
import type { LayoutItem } from "@/types/layout";
import ChangesSavedPill from "../changes-saved-pill";
import AccountForm from "../form";
import SaveErrorPill from "../save-error-pill";
import LayoutBuilder from "./layout-builder";
import STUDIO_PAGE_FORM_FIELDS from "./STUDIO_PAGE_FORM_FIELDS";

const STORAGE_KEY_PREFIX = "account-studio-page-";

export default function AccountStudioPage() {
  const {
    studio,
    isLoading,
    refetchStudio,
    updateStudioPageSettings,
  } = useStudio();

  const [formValues, setFormValues] = useState<
    Record<string, string>
  >({});
  const [pageLayout, setPageLayout] = useState<
    LayoutItem[]
  >(DEFAULT_PAGE_LAYOUT);
  const [isInitialized, setIsInitialized] = useState(false);
  const formValuesRef = useRef(formValues);
  const pageLayoutRef = useRef(pageLayout);

  useEffect(() => {
    formValuesRef.current = formValues;
    pageLayoutRef.current = pageLayout;
  }, [formValues, pageLayout]);

  const studioFormDefaults = useMemo(
    () =>
      studio
        ? {
            headerFont: studio.headerFont,
            textFont: studio.textFont || "",
            gradientFrom:
              studio.gradient?.from || "#FFF8E8",
            gradientTo: studio.gradient?.to || "#F2F2F2",
          }
        : null,
    [studio]
  );

  const studioLayout = useMemo(
    () =>
      (studio?.pageLayout as LayoutItem[] | undefined)
        ?.length
        ? (studio?.pageLayout as LayoutItem[])
        : DEFAULT_PAGE_LAYOUT,
    [studio]
  );

  // Initialize: use Firebase layout as source of truth; localStorage only for form draft
  useEffect(() => {
    if (!studio?.id || !studioFormDefaults) return;

    const storageKey = `${STORAGE_KEY_PREFIX}${studio.id}`;

    const applyState = () => {
      try {
        const stored = localStorage.getItem(storageKey);
        const parsed = stored
          ? (JSON.parse(stored) as {
              form?: Record<string, string>;
              layout?: LayoutItem[];
            })
          : null;

        setFormValues({
          ...studioFormDefaults,
          ...parsed?.form,
        });
        // Always use studioLayout (Firebase) for layout - avoids stale localStorage overwriting
        setPageLayout(studioLayout);
      } catch {
        setFormValues(studioFormDefaults);
        setPageLayout(studioLayout);
      }
      setIsInitialized(true);
    };

    queueMicrotask(applyState);
  }, [studio?.id, studioFormDefaults, studioLayout]);

  const hasChanges = useMemo(() => {
    if (!isInitialized || !studio) return false;
    const formChanged =
      formValues.headerFont !==
        studioFormDefaults?.headerFont ||
      formValues.textFont !==
        studioFormDefaults?.textFont ||
      formValues.gradientFrom !==
        studioFormDefaults?.gradientFrom ||
      formValues.gradientTo !==
        studioFormDefaults?.gradientTo;
    const layoutChanged =
      JSON.stringify(pageLayout) !==
      JSON.stringify(studioLayout);
    return formChanged || layoutChanged;
  }, [
    formValues,
    pageLayout,
    studioFormDefaults,
    studioLayout,
    isInitialized,
    studio,
  ]);

  const persistToStorage = useCallback(
    (
      form: Record<string, string>,
      layout: LayoutItem[]
    ) => {
      if (!studio?.id) return;
      try {
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${studio.id}`,
          JSON.stringify({ form, layout })
        );
      } catch {
        // Ignore quota errors
      }
    },
    [studio]
  );

  const saveToFirebase = useCallback(
    async (data: {
      form: Record<string, string>;
      layout: LayoutItem[];
    }) => {
      const payload: Parameters<
        typeof updateStudioPageSettings
      >[0] = {};

      if (data.form) {
        payload.headerFont = data.form.headerFont;
        payload.textFont = data.form.textFont;
        const from = data.form.gradientFrom;
        const to = data.form.gradientTo;
        if (from && to) {
          payload.gradient = { from, to };
        }
      }

      payload.pageLayout =
        data.layout?.length > 0
          ? data.layout
          : DEFAULT_PAGE_LAYOUT;

      await updateStudioPageSettings(payload);
    },
    [updateStudioPageSettings]
  );

  const handleFormChange = useCallback(
    (values: Record<string, string>) => {
      const prev = formValuesRef.current;
      const gradient = values.gradient;
      let gradientFrom = prev.gradientFrom;
      let gradientTo = prev.gradientTo;
      if (gradient) {
        try {
          const parsed = JSON.parse(gradient) as {
            from?: string;
            to?: string;
          };
          gradientFrom = parsed.from ?? gradientFrom;
          gradientTo = parsed.to ?? gradientTo;
        } catch {
          // keep existing
        }
      }
      const newForm = {
        ...values,
        gradientFrom,
        gradientTo,
      };
      persistToStorage(newForm, pageLayoutRef.current);
      setFormValues(newForm);
    },
    [persistToStorage]
  );

  const combinedData = useMemo(
    () => ({ form: formValues, layout: pageLayout }),
    [formValues, pageLayout]
  );

  const {
    showSaved,
    saveError,
    retry,
    triggerSaved,
    setSaveError,
  } = useAutosave({
    storageKey: studio?.id
      ? `${STORAGE_KEY_PREFIX}${studio.id}`
      : "",
    data: combinedData,
    saveFn: saveToFirebase,
    enabled: hasChanges && !!studio?.id,
  });

  const handleLayoutChange = useCallback(
    (layout: LayoutItem[]) => {
      persistToStorage(formValuesRef.current, layout);
      setPageLayout(layout);
      // Immediately save to Firebase when layout changes (add block, modal save, etc.)
      saveToFirebase({
        form: formValuesRef.current,
        layout,
      })
        .then(async () => {
          triggerSaved();
          // Refetch to ensure we have canonical data from Firebase (avoids stale/cache issues)
          await refetchStudio();
          if (studio?.id) {
            try {
              localStorage.removeItem(
                `${STORAGE_KEY_PREFIX}${studio.id}`
              );
            } catch {
              // Ignore
            }
          }
        })
        .catch((err) => {
          setSaveError(
            err instanceof Error
              ? err.message
              : "Failed to save"
          );
        });
    },
    [
      persistToStorage,
      saveToFirebase,
      triggerSaved,
      setSaveError,
      refetchStudio,
      studio,
    ]
  );

  const handlePreview = () => {
    if (!studio?.id) return;
    window.open(`/preview/${studio.id}`, "_blank");
  };

  const displayFormValues = useMemo(() => {
    const base =
      Object.keys(formValues).length > 0
        ? formValues
        : (studioFormDefaults ?? {});
    const from = base.gradientFrom ?? "#FFF8E8";
    const to = base.gradientTo ?? "#F2F2F2";
    return {
      ...base,
      gradient: JSON.stringify({ from, to }),
    };
  }, [formValues, studioFormDefaults]);

  return (
    <div className="relative flex w-full flex-col gap-y-10">
      <AccountForm
        title="Design"
        FORM_FIELDS={STUDIO_PAGE_FORM_FIELDS}
        initialValues={displayFormValues}
        onChange={handleFormChange}
        isLoading={isLoading}
      />

      {studio?.id && (
        <div className="relative flex w-full flex-col gap-y-4">
          <h2 className="font-bold font-ortank text-xl">
            Layout
          </h2>
          <LayoutBuilder
            value={pageLayout}
            onChange={handleLayoutChange}
            studioId={studio.id}
          />
        </div>
      )}

      {studio?.id && (
        <div className="fixed right-6 bottom-6 z-50">
          <ButtonPreviewPage onClick={handlePreview} />
        </div>
      )}

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
