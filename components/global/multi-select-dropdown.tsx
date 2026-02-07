"use client";

import { useState, useRef, useEffect } from "react";
import {
  RiArrowDownSLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import type { MultiSelectDropdownProps } from "@/types/components";

export default function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  label,
  showTags = true,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent flex items-center justify-between bg-transparent text-left"
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
          className={`w-5 h-5 text-neutral-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
              >
                <span className="text-sm text-neutral-700">
                  {option.label}
                </span>
                {isSelected && (
                  <RiCheckLine className="w-4 h-4 text-black" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Selected tags */}
      {showTags && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((v) => {
            const option = options.find(
              (opt) => opt.value === v
            );
            return (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-md text-sm"
              >
                {option?.label || v}
                <button
                  type="button"
                  onClick={() => handleToggleOption(v)}
                  className="hover:text-red-500 transition-colors"
                >
                  <RiCloseLine className="w-4 h-4" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
