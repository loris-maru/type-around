"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CustomSelectProps } from "@/types/components";
import { cn } from "@/utils/class-names";

export default function CustomSelect({
  value,
  options,
  onChange,
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({
    top: 0,
    left: 0,
    minWidth: 0,
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect =
        triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + 4,
        left: rect.right,
        minWidth: rect.width,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const inTrigger =
        triggerRef.current?.contains(target);
      const inDropdown =
        dropdownRef.current?.contains(target);
      if (!inTrigger && !inDropdown) {
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

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? value;

  return (
    <>
      <div
        ref={triggerRef}
        className={cn("relative", className)}
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-neutral-300 bg-white px-4 py-3 font-whisper text-sm transition-colors hover:border-neutral-400"
        >
          <span
            className={cn(
              value ? "text-black" : "text-neutral-500"
            )}
          >
            {selectedLabel}
          </span>
          <svg
            aria-hidden
            className={cn(
              "h-5 w-5 text-neutral-400 transition-transform",
              isOpen && "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>Dropdown</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] rounded-lg border border-neutral-200 bg-white shadow-lg"
            style={{
              top: dropdownStyle.top,
              left: dropdownStyle.left,
              minWidth: dropdownStyle.minWidth,
              transform: "translateX(-100%)",
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex w-full items-center gap-2 whitespace-nowrap px-4 py-2 text-left font-whisper text-sm transition-colors",
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
          </div>,
          document.body
        )}
    </>
  );
}
