"use client";

import { useRef, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import type { TagInputProps } from "@/types/components";
import { cn } from "@/utils/class-names";

export default function TagInput({
  label,
  value,
  onChange,
  placeholder = "Type and press Enter...",
  theme = "dark",
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const trimmedValue = inputValue.trim();

    if (e.key === "Enter" && trimmedValue) {
      e.preventDefault();
      // Don't add duplicates (case-insensitive)
      if (
        !value.some(
          (v) =>
            v.toLowerCase() === trimmedValue.toLowerCase()
        )
      ) {
        onChange([...value, trimmedValue]);
      }
      setInputValue("");
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      value.length > 0
    ) {
      // Remove last tag when backspace is pressed on empty input
      onChange(value.slice(0, -1));
    } else if (e.key === "," && trimmedValue) {
      // Also allow comma as separator
      e.preventDefault();
      if (
        !value.some(
          (v) =>
            v.toLowerCase() === trimmedValue.toLowerCase()
        )
      ) {
        onChange([...value, trimmedValue]);
      }
      setInputValue("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    onChange(
      value.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={className}>
      <label
        htmlFor={label}
        className="mb-2 block font-normal font-whisper text-black text-sm"
      >
        {label}
      </label>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: click delegates focus to inner input */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: container delegates focus to inner input */}
      <div
        onClick={handleContainerClick}
        className={cn(
          "min-h-[48px] w-full cursor-text rounded-lg border px-3 py-2 transition-colors",
          "flex flex-wrap items-center gap-2",
          isFocused
            ? "border-black ring-2 ring-black ring-opacity-20"
            : "border-neutral-300 hover:border-neutral-400"
        )}
      >
        {/* Tags */}
        {value.map((tag, index) => (
          <span
            key={`${tag}`}
            className={cn(
              "group inline-flex items-center gap-1 rounded-3xl px-5 py-2 text-sm",
              theme === "dark"
                ? "bg-black text-white"
                : "border border-black bg-transparent text-black"
            )}
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTag(index);
              }}
              aria-label={`Remove ${tag}`}
              className={cn(
                "rounded p-0.5 transition-colors",
                theme === "dark"
                  ? "hover:bg-neutral-200"
                  : "hover:bg-neutral-100"
              )}
            >
              <RiCloseLine
                className={cn(
                  "h-3.5 w-3.5",
                  theme === "dark"
                    ? "text-neutral-500 group-hover:text-neutral-700"
                    : "text-neutral-400 group-hover:text-black"
                )}
              />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          id={`tag-input-${label}`}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={
            value.length === 0 ? placeholder : ""
          }
          aria-label={label}
          className="min-w-[120px] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-neutral-400"
        />
      </div>
      <p className="mt-1 text-neutral-500 text-xs">
        Press Enter or comma to add a category
      </p>
    </div>
  );
}
