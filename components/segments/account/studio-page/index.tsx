"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import {
  ButtonPreviewPage,
  ButtonSaveForm,
} from "@/components/molecules/buttons";
import { DEFAULT_PAGE_LAYOUT } from "@/constant/DEFAULT_PAGE_LAYOUT";
import { useStudio } from "@/hooks/use-studio";
import type { LayoutItem } from "@/types/layout";
import AccountForm from "../form";
import LayoutBuilder from "./layout-builder";
import STUDIO_PAGE_FORM_FIELDS from "./STUDIO_PAGE_FORM_FIELDS";

export default function AccountStudioPage() {
  const { studio, isLoading, updateStudioPageSettings } =
    useStudio();
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] =
    useState(false);

  // Track pending values locally so we can batch-save
  const pendingFormValues = useRef<Record<
    string,
    string
  > | null>(null);
  const pendingLayout = useRef<LayoutItem[] | null>(null);

  const handleFormChange = (
    values: Record<string, string>
  ) => {
    pendingFormValues.current = values;
    setHasUnsavedChanges(true);
  };

  const handleLayoutChange = (layout: LayoutItem[]) => {
    pendingLayout.current = layout;
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;
    setIsSaving(true);
    try {
      const formVals = pendingFormValues.current;
      const layout = pendingLayout.current;

      const payload: Parameters<
        typeof updateStudioPageSettings
      >[0] = {};

      if (formVals) {
        payload.headerFont = formVals.headerFont;
        payload.textFont = formVals.textFont;
        const from = formVals.gradientFrom;
        const to = formVals.gradientTo;
        if (from && to) {
          payload.gradient = { from, to };
        }
      }

      if (layout) {
        payload.pageLayout = layout;
      } else {
        payload.pageLayout = (
          studio?.pageLayout as LayoutItem[] | undefined
        )?.length
          ? (studio?.pageLayout as LayoutItem[])
          : DEFAULT_PAGE_LAYOUT;
      }

      await updateStudioPageSettings(payload);

      pendingFormValues.current = null;
      pendingLayout.current = null;
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (!studio?.id) return;
    window.open(`/preview/${studio.id}`, "_blank");
  };

  // Use pending values if the user has edited them, otherwise studio values
  const formValues =
    pendingFormValues.current ??
    (studio
      ? {
          headerFont: studio.headerFont,
          textFont: studio.textFont || "",
          gradientFrom: studio.gradient?.from || "#FFF8E8",
          gradientTo: studio.gradient?.to || "#F2F2F2",
        }
      : undefined);

  return (
    <div className="relative flex w-full flex-col gap-y-10">
      <AccountForm
        title="Design"
        FORM_FIELDS={STUDIO_PAGE_FORM_FIELDS}
        initialValues={formValues}
        onChange={handleFormChange}
        isLoading={isLoading}
      />

      {studio?.id && (
        <div className="relative flex w-full flex-col gap-y-4">
          <h2 className="font-bold font-ortank text-xl">
            Layout
          </h2>
          <LayoutBuilder
            value={
              (studio.pageLayout as LayoutItem[])?.length
                ? (studio.pageLayout as LayoutItem[])
                : DEFAULT_PAGE_LAYOUT
            }
            onChange={handleLayoutChange}
            studioId={studio.id}
          />
        </div>
      )}

      {/* Fixed bottom-right buttons */}
      {studio?.id && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3">
          {/* Preview — always visible */}
          <ButtonPreviewPage onClick={handlePreview} />

          {/* Save — slides in when there are changes */}
          <AnimatePresence>
            {hasUnsavedChanges && (
              <motion.div
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 60, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <ButtonSaveForm
                  onClick={handleSave}
                  disabled={isSaving}
                  label="Save"
                  loadingLabel="Saving..."
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
