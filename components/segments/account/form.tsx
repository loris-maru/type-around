"use client";

import { useState, useEffect } from "react";
import { FormField } from "@/types/forms";

type FormValues = Record<string, string>;

export default function AccountForm({
  title,
  FORM_FIELDS,
  initialValues,
  onSubmit,
  isLoading,
}: {
  FORM_FIELDS: FormField[];
  title: string;
  initialValues?: FormValues;
  onSubmit?: (values: FormValues) => Promise<void>;
  isLoading?: boolean;
}) {
  const [values, setValues] = useState<FormValues>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form values when initialValues changes
  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = (slug: string, value: string) => {
    setValues((prev) => ({ ...prev, [slug]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    try {
      setIsSaving(true);
      await onSubmit(values);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative w-full flex flex-col gap-y-4">
      <h2 className="text-xl font-ortank font-bold">
        {title}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-2 gap-6">
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
                  className="text-base font-normal text-neutral-500 mb-2"
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
                      handleChange(
                        field.slug,
                        e.target.value
                      )
                    }
                    disabled={isLoading}
                    className={`w-full pr-6 py-5 border border-neutral-300 placeholder:text-black placeholder:text-base placeholder:font-whisper placeholder:font-medium disabled:bg-neutral-100 disabled:cursor-not-allowed ${Icon ? "pl-12" : "pl-6"}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {onSubmit && (
          <button
            type="submit"
            disabled={isSaving || isLoading}
            className="self-end px-8 py-3 bg-black text-white font-whisper font-medium hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        )}
      </form>
    </div>
  );
}
