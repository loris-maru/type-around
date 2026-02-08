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
    <div className="relative w-full flex flex-col gap-y-4">
      <h2 className="text-xl font-ortank font-bold">
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

          return (
            <div
              key={field.slug}
              className="relative w-full"
            >
              <label
                htmlFor={field.slug}
                className="block font-whisper text-sm font-normal text-black mb-2"
              >
                {field.label}
              </label>
              <div className="relative w-full">
                {Icon && (
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
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
                  className={`w-full pr-6 py-5 border border-neutral-300 placeholder:text-black placeholder:text-base placeholder:font-whisper placeholder:font-medium disabled:bg-neutral-100 disabled:cursor-not-allowed ${Icon ? "pl-12" : "pl-6"}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
