"use client";

import { useStudio } from "@/hooks/use-studio";
import AccountForm from "./form";
import STUDIO_PAGE_FORM_FIELDS from "./studio-page/STUDIO_PAGE_FORM_FIELDS";

export default function AccountStudioPage() {
  const { studio, isLoading, updateStudioPageSettings } =
    useStudio();

  const handleSubmit = async (
    values: Record<string, string>
  ) => {
    // Parse gradient values if they exist
    const gradientFrom = values.gradientFrom;
    const gradientTo = values.gradientTo;

    await updateStudioPageSettings({
      headerFont: values.headerFont,
      gradient:
        gradientFrom && gradientTo
          ? { from: gradientFrom, to: gradientTo }
          : undefined,
    });
  };

  const initialValues = studio
    ? {
        headerFont: studio.headerFont,
        gradientFrom: studio.gradient?.from || "#FFF8E8",
        gradientTo: studio.gradient?.to || "#F2F2F2",
      }
    : undefined;

  return (
    <div className="relative w-full">
      <AccountForm
        title="Design"
        FORM_FIELDS={STUDIO_PAGE_FORM_FIELDS}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
