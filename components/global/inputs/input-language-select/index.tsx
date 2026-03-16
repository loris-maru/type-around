"use client";

import { useEffect, useId, useRef, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { SUPPORTED_LANGUAGES } from "@/constant/SUPPORTED_LANGUAGES";
import { cn } from "@/utils/class-names";

type LanguageSelectProps = {
  label: string;
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  theme?: "dark" | "light";
  className?: string;
};

export default function InputLanguageSelect({
  label,
  value,
  onChange,
  placeholder = "Type to search languages...",
  theme = "light",
  className,
}: LanguageSelectProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] =
    useState(0);
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const queryLower = query.trim().toLowerCase();
  const suggestions = SUPPORTED_LANGUAGES.filter(
    (lang) =>
      !value.includes(lang) &&
      (queryLower === "" ||
        lang.toLowerCase().includes(queryLower))
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) return;
    const idx = Math.min(
      highlightedIndex,
      suggestions.length - 1
    );
    const el = listRef.current?.children[
      idx
    ] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, isOpen, suggestions.length]);

  const handleSelect = (lang: string) => {
    if (!value.includes(lang)) {
      onChange([...value, lang]);
    }
    setQuery("");
    setHighlightedIndex(0);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key !== "Escape") {
      if (
        e.key === "Backspace" &&
        !query &&
        value.length > 0
      ) {
        onChange(value.slice(0, -1));
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) =>
          i < suggestions.length - 1 ? i + 1 : i
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => (i > 0 ? i - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setQuery("");
        break;
      case "Backspace":
        if (!query && value.length > 0) {
          onChange(value.slice(0, -1));
        }
        break;
      default:
        break;
    }
  };

  const handleRemove = (lang: string) => {
    onChange(value.filter((v) => v !== lang));
    setHighlightedIndex(0);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
    >
      <label
        htmlFor={`language-select-${label}`}
        className="mb-2 block font-normal font-whisper text-black text-sm"
      >
        {label}
      </label>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: click delegates focus to inner input */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: container delegates focus to inner input */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "min-h-[48px] w-full cursor-text rounded-lg border px-3 py-2 transition-colors",
          "flex flex-wrap items-center gap-2",
          isOpen
            ? "border-black ring-2 ring-black ring-opacity-20"
            : "border-neutral-300 hover:border-neutral-400"
        )}
      >
        {value.map((lang) => (
          <span
            key={lang}
            className={cn(
              "group inline-flex items-center gap-1 rounded-3xl px-5 py-2 text-sm",
              theme === "dark"
                ? "bg-black text-white"
                : "border border-black bg-transparent text-black"
            )}
          >
            {lang}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(lang);
              }}
              aria-label={`Remove ${lang}`}
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
        <input
          ref={inputRef}
          id={`language-select-${label}`}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlightedIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            value.length === 0 ? placeholder : ""
          }
          aria-label={label}
          aria-autocomplete="list"
          className="min-w-[140px] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-neutral-400"
        />
      </div>
      {isOpen && suggestions.length > 0 && (
        <ul
          id={listId}
          ref={listRef}
          className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-neutral-300 bg-white shadow-lg"
        >
          {suggestions.map((lang, i) => (
            <li key={lang}>
              <button
                type="button"
                onMouseEnter={() => setHighlightedIndex(i)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(lang);
                }}
                className={cn(
                  "w-full cursor-pointer px-4 py-2.5 text-left text-sm transition-colors",
                  i === highlightedIndex
                    ? "bg-neutral-100 text-black"
                    : "text-neutral-700 hover:bg-neutral-50"
                )}
              >
                {lang}
              </button>
            </li>
          ))}
        </ul>
      )}
      {isOpen &&
        query.trim() &&
        suggestions.length === 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-500 text-sm shadow-lg">
            No matching languages
          </div>
        )}
      <p className="mt-1 text-neutral-500 text-xs">
        Type to search and select from the list
      </p>
    </div>
  );
}
