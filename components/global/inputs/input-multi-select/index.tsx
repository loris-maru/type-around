"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  RiArrowDownSLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import type { MultiSelectDropdownProps } from "@/types/components";

export default function InputMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  label,
  showTags = true,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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

  const handleToggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const getSelectedLabels = () => {
    return value
      .map(
        (v) =>
          options.find((opt) => opt.value === v)?.label || v
      )
      .join(", ");
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block font-normal font-whisper text-black text-sm"
        >
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-neutral-300 bg-transparent px-4 py-3 text-left focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
      >
        <span
          className={
            value.length > 0
              ? "text-black"
              : "text-neutral-400"
          }
        >
          {value.length > 0
            ? getSelectedLabels()
            : placeholder}
        </span>
        <RiArrowDownSLine
          className={`h-5 w-5 text-neutral-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-neutral-300 bg-white shadow-lg">
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleOption(option.value);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-neutral-50"
              >
                <span className="text-neutral-700 text-sm">
                  {option.label}
                </span>
                {isSelected && (
                  <RiCheckLine className="h-4 w-4 text-black" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {showTags && value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((v) => {
            const option = options.find(
              (opt) => opt.value === v
            );
            return (
              <span
                key={v}
                className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-sm"
              >
                {option?.label || v}
                <button
                  type="button"
                  onClick={() => handleToggleOption(v)}
                  className="transition-colors hover:text-red-500"
                >
                  <RiCloseLine className="h-4 w-4" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
