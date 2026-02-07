"use client";

import { useEffect, useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import type { CustomSelectProps } from "@/types/components";
import { cn } from "@/utils/class-names";

export default function CustomSelect({
  value,
  options,
  onChange,
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (opt) => opt.value === value
  );

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

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={cn("relative", className)}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-whisper font-medium transition-colors",
          isOpen
            ? "border-black bg-white"
            : "border-neutral-300 bg-white hover:border-neutral-400"
        )}
      >
        {selectedOption?.icon && (
          <span className="shrink-0">
            {selectedOption.icon}
          </span>
        )}
        <span>{selectedOption?.label || value}</span>
        <RiArrowDropDownLine
          className={cn(
            "w-5 h-5 text-neutral-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 right-0 mt-1 min-w-full bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full px-4 py-2 text-left text-sm font-whisper transition-colors whitespace-nowrap flex items-center gap-2",
                option.value === value
                  ? "bg-neutral-100 font-medium text-black"
                  : "text-neutral-700 hover:bg-neutral-50"
              )}
            >
              {option.icon && (
                <span className="shrink-0">
                  {option.icon}
                </span>
              )}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
