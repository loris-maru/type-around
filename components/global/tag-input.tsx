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
        className="block font-whisper text-sm font-normal text-black mb-2"
      >
        {label}
      </label>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: click delegates focus to inner input */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: container delegates focus to inner input */}
      <div
        onClick={handleContainerClick}
        className={cn(
          "w-full min-h-[48px] px-3 py-2 border rounded-lg cursor-text transition-colors",
          "flex flex-wrap gap-2 items-center",
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
              "inline-flex items-center gap-1 px-5 py-2 text-sm rounded-3xl group",
              theme === "dark"
                ? "bg-black text-white"
                : "bg-transparent text-black border border-black"
            )}
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTag(index);
              }}
              className={cn(
                "p-0.5 rounded transition-colors",
                theme === "dark"
                  ? "hover:bg-neutral-200"
                  : "hover:bg-neutral-100"
              )}
            >
              <RiCloseLine
                className={cn(
                  "w-3.5 h-3.5",
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
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={
            value.length === 0 ? placeholder : ""
          }
          className="flex-1 min-w-[120px] py-1 bg-transparent outline-none text-sm placeholder:text-neutral-400"
        />
      </div>
      <p className="mt-1 text-xs text-neutral-500">
        Press Enter or comma to add a category
      </p>
    </div>
  );
}
