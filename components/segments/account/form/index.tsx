"use client";

import { useCallback, useMemo } from "react";
import type { FormValues } from "@/types/components";
import type { FormField } from "@/types/forms";
import { cn } from "@/utils/class-names";

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
    <div className="relative flex w-full flex-col gap-y-6">
      {title && <h2 className="swiss-h2">{title}</h2>}
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        {FORM_FIELDS.map((field, fieldIndex) => {
          const Icon = field.icon;
          const CustomComponent = field.customComponent;
          const fieldNumber = String(
            fieldIndex + 1
          ).padStart(2, "0");

          // Render custom component if provided
          if (CustomComponent) {
            const colSpan = field.colSpan ?? 2;
            return (
              <div
                key={field.slug}
                className={cn(
                  "relative w-full",
                  colSpan === 2
                    ? "col-span-8"
                    : "col-span-4"
                )}
              >
                <CustomComponent
                  value={values[field.slug]}
                  onChange={(value: string) =>
                    handleChange(field.slug, value)
                  }
                  label={field.label}
                  disabled={isLoading}
                />
              </div>
            );
          }

          if (field.type === "textarea") {
            return (
              <div
                key={field.slug}
                className="relative col-span-8 w-full"
              >
                <label
                  htmlFor={field.slug}
                  className="swiss-label mb-3 flex items-center gap-3 text-neutral-500"
                >
                  <span className="swiss-num text-neutral-400">
                    {fieldNumber}
                  </span>
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
                  className="swiss-field resize-y"
                />
              </div>
            );
          }

          return (
            <div
              key={field.slug}
              className="relative col-span-4 w-full"
            >
              <label
                htmlFor={field.slug}
                className="swiss-label mb-3 flex items-center gap-3 text-neutral-500"
              >
                <span className="swiss-num text-neutral-400">
                  {fieldNumber}
                </span>
                {field.label}
              </label>
              <div className="relative w-full">
                {Icon && (
                  <Icon className="absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 text-black" />
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
                  className={cn(
                    "swiss-field",
                    Icon ? "pl-7" : "pl-0"
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
