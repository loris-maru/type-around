"use client";

import type { FormInputProps } from "@/types/components";

export default function FormInput({
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
        className="block text-sm font-normal text-neutral-700 mb-1"
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
        className="w-full font-whisper font-semibold text-base text-black px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
      />
    </div>
  );
}
