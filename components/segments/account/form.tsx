"use client";

import { useCallback, useMemo } from "react";
import type { FormValues } from "@/types/components";
import type { FormField } from "@/types/forms";

export default function AccountForm({
  title,
  FORM_FIELDS,
  initialValues,
  onChange,
  isLoading,
}: {
  FORM_FIELDS: FormField[];
  title: string;
  initialValues?: FormValues;
  onChange?: (values: FormValues) => void;
  isLoading?: boolean;
}) {
  // Use initialValues directly as source of truth
  const values = useMemo(
    () => initialValues || {},
    [initialValues]
  );

  const handleChange = useCallback(
    (slug: string, value: string) => {
      const newValues = { ...values, [slug]: value };
      onChange?.(newValues);
    },
    [onChange, values]
  );

  return (
    <div className="relative flex w-full flex-col gap-y-4">
      <h2 className="font-bold font-ortank text-xl">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-12">
        {FORM_FIELDS.map((field) => {
          const Icon = field.icon;
          const CustomComponent = field.customComponent;

          // Render custom component if provided
          if (CustomComponent) {
            return (
              <div
                key={field.slug}
                className="relative w-full"
              >
                <CustomComponent
                  value={values[field.slug]}
                  onChange={(value: string) =>
                    handleChange(field.slug, value)
                  }
                />
              </div>
            );
          }

          if (field.type === "textarea") {
            return (
              <div
                key={field.slug}
                className="relative col-span-2 w-full"
              >
                <label
                  htmlFor={field.slug}
                  className="mb-2 block font-normal font-whisper text-black text-sm"
                >
                  {field.label}
                </label>
                <textarea
                  id={field.slug}
                  name={field.slug}
                  placeholder={field.placeholder}
                  value={values[field.slug] || ""}
                  onChange={(e) =>
                    handleChange(field.slug, e.target.value)
                  }
                  disabled={isLoading}
                  rows={4}
                  aria-label={field.label}
                  className="w-full resize-y border border-neutral-300 px-6 py-5 font-whisper text-base placeholder:font-medium placeholder:font-whisper placeholder:text-base placeholder:text-black disabled:cursor-not-allowed disabled:bg-neutral-100"
                />
              </div>
            );
          }

          return (
            <div
              key={field.slug}
              className="relative w-full"
            >
              <label
                htmlFor={field.slug}
                className="mb-2 block font-normal font-whisper text-black text-sm"
              >
                {field.label}
              </label>
              <div className="relative w-full">
                {Icon && (
                  <Icon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-black" />
                )}
                <input
                  type={field.type}
                  id={field.slug}
                  name={field.slug}
                  placeholder={field.placeholder}
                  value={values[field.slug] || ""}
                  onChange={(e) =>
                    handleChange(field.slug, e.target.value)
                  }
                  disabled={isLoading}
                  className={`w-full border border-neutral-300 py-5 pr-6 placeholder:font-medium placeholder:font-whisper placeholder:text-base placeholder:text-black disabled:cursor-not-allowed disabled:bg-neutral-100 ${Icon ? "pl-12" : "pl-6"}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
