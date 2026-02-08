"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { RiEyeLine, RiSaveLine } from "react-icons/ri";
import { useStudio } from "@/hooks/use-studio";
import type { LayoutItem } from "@/types/layout";
import AccountForm from "./form";
import LayoutBuilder from "./studio-page/layout-builder";
import STUDIO_PAGE_FORM_FIELDS from "./studio-page/STUDIO_PAGE_FORM_FIELDS";

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
        const from = formVals.gradientFrom;
        const to = formVals.gradientTo;
        if (from && to) {
          payload.gradient = { from, to };
        }
      }

      if (layout) {
        payload.pageLayout = layout;
      } else {
        payload.pageLayout =
          (studio?.pageLayout as LayoutItem[]) || [];
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
          gradientFrom: studio.gradient?.from || "#FFF8E8",
          gradientTo: studio.gradient?.to || "#F2F2F2",
        }
      : undefined);

  return (
    <div className="relative w-full flex flex-col gap-y-10">
      <AccountForm
        title="Design"
        FORM_FIELDS={STUDIO_PAGE_FORM_FIELDS}
        initialValues={formValues}
        onChange={handleFormChange}
        isLoading={isLoading}
      />

      {studio?.id && (
        <div className="relative w-full flex flex-col gap-y-4">
          <h2 className="text-xl font-ortank font-bold">
            Layout
          </h2>
          <LayoutBuilder
            value={
              (studio.pageLayout as LayoutItem[]) || []
            }
            onChange={handleLayoutChange}
            studioId={studio.id}
          />
        </div>
      )}

      {/* Fixed bottom-right buttons */}
      {studio?.id && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Preview — always visible */}
          <button
            type="button"
            onClick={handlePreview}
            className="flex items-center justify-center gap-2 w-40 py-3 bg-white text-black border border-black rounded-lg hover:bg-neutral-100 transition-colors shadow-lg cursor-pointer"
          >
            <RiEyeLine className="w-5 h-5" />
            Preview
          </button>

          {/* Save — slides in when there are changes */}
          <AnimatePresence>
            {hasUnsavedChanges && (
              <motion.button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 w-40 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors shadow-lg cursor-pointer"
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 60, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <RiSaveLine className="w-5 h-5" />
                {isSaving ? "Saving..." : "Save"}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
