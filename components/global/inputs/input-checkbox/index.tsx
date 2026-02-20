"use client";

import { useId } from "react";
import { cn } from "@/utils/class-names";

type InputCheckboxProps = {
  id?: string;
  name?: string;
  label?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
};

export default function InputCheckbox({
  id,
  name,
  label,
  checked,
  onChange,
  disabled = false,
  className,
  inputClassName,
}: InputCheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const box = (
    <span
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-neutral-300 bg-transparent transition-colors",
        checked && "border-black",
        !disabled && "cursor-pointer",
        disabled && "cursor-not-allowed opacity-50",
        inputClassName
      )}
    >
      {checked && (
        <svg
          className="h-2.5 w-2.5 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <title>Check</title>
          <path d="M5 12l5 5L20 7" />
        </svg>
      )}
    </span>
  );

  const input = (
    <input
      type="checkbox"
      id={inputId}
      name={name}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className="sr-only"
      tabIndex={-1}
      aria-hidden
    />
  );

  if (label) {
    return (
      <label
        className={cn(
          "flex cursor-pointer items-center gap-2",
          disabled && "cursor-not-allowed",
          className
        )}
        htmlFor={inputId}
      >
        {input}
        {box}
        <span className="font-whisper text-black text-sm">
          {label}
        </span>
      </label>
    );
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: Custom checkbox uses native input (sr-only) for form/accessibility; button provides custom visual
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      className={cn(
        "relative inline-flex cursor-pointer border-none bg-transparent p-0",
        disabled && "cursor-not-allowed",
        className
      )}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (!disabled) onChange(!checked);
        }
      }}
    >
      {input}
      {box}
    </button>
  );
}
