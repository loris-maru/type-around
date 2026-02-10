"use client";

import type { FormTextareaProps } from "@/types/components";

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  rows = 4,
  required = false,
  placeholder,
}: FormTextareaProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block font-normal font-whisper text-black text-sm"
      >
        {label}
        {required && (
          <span className="text-red-500"> *</span>
        )}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="min-h-[300px] w-full resize-y rounded-lg border border-neutral-300 bg-transparent px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
        style={
          { fieldSizing: "content" } as React.CSSProperties
        }
      />
    </div>
  );
}
