"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  RiArrowDownSLine,
  RiCheckLine,
} from "react-icons/ri";
import { cn } from "@/utils/class-names";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

type CustomSelectProps<T extends string = string> = {
  value: T | "";
  options: SelectOption<T>[];
  onChange: (value: T | "") => void;
  placeholder?: string;
  label?: string;
  id?: string;
  className?: string;
};

export default function CustomSelect<
  T extends string = string,
>({
  value,
  options,
  onChange,
  placeholder = "Select…",
  label,
  id: externalId,
  className,
}: CustomSelectProps<T>) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const selected = options.find((o) => o.value === value);

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
    >
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block font-whisper text-black text-xs uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="flex w-full items-center justify-between rounded-lg border border-neutral-300 bg-white px-3 py-2.5 font-whisper text-sm transition-colors hover:border-neutral-400 focus:border-black focus:outline-none"
      >
        <span
          className={cn(
            "truncate",
            selected ? "text-black" : "text-neutral-400"
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <RiArrowDownSLine
          className={cn(
            "ml-1 h-4 w-4 shrink-0 text-neutral-500 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
          {options.length === 0 ? (
            <p className="px-3 py-2.5 font-whisper text-neutral-400 text-sm">
              No options
            </p>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2.5 text-left font-whisper text-sm transition-colors hover:bg-neutral-50",
                    isSelected && "font-semibold text-black"
                  )}
                >
                  <span className="truncate">
                    {opt.label}
                  </span>
                  {isSelected && (
                    <RiCheckLine className="ml-2 h-3.5 w-3.5 shrink-0 text-black" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
