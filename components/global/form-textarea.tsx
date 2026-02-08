"use client";

import { FormTextareaProps } from "@/types/components";

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
        className="block font-whisper text-sm font-normal text-black mb-2"
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
        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
      />
    </div>
  );
}
