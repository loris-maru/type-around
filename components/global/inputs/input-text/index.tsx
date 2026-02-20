"use client";

import type { FormInputProps } from "@/types/components";

export default function InputText({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  min,
  max,
  step,
}: FormInputProps) {
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
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-lg border border-neutral-300 px-4 py-3 font-semibold font-whisper text-base text-black focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}
