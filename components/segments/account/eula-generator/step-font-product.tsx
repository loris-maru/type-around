"use client";

import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { useEulaStore } from "@/stores/eula-store";
import { FONT_FORMAT_OPTIONS } from "@/types/eula";
import type { FontProduct } from "@/types/eula";

export default function StepFontProduct() {
  const { fontProduct, updateFontProduct } = useEulaStore();
  const [familyInput, setFamilyInput] = useState("");

  const addFontFamily = () => {
    const trimmed = familyInput.trim();
    if (
      trimmed &&
      !fontProduct.fontFamilies.includes(trimmed)
    ) {
      updateFontProduct({
        fontFamilies: [
          ...fontProduct.fontFamilies,
          trimmed,
        ],
      });
      setFamilyInput("");
    }
  };

  const removeFontFamily = (family: string) => {
    updateFontProduct({
      fontFamilies: fontProduct.fontFamilies.filter(
        (f) => f !== family
      ),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFontFamily();
    }
  };

  const toggleFormat = (
    format: FontProduct["fontFormats"][number]
  ) => {
    const current = fontProduct.fontFormats;
    if (current.includes(format)) {
      updateFontProduct({
        fontFormats: current.filter((f) => f !== format),
      });
    } else {
      updateFontProduct({
        fontFormats: [...current, format],
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-y-6">
      <div>
        <h3 className="font-bold font-ortank text-lg">
          Font Product Details
        </h3>
        <p className="mt-1 font-whisper text-neutral-500 text-sm">
          Information about the font(s) covered by this
          license agreement.
        </p>
      </div>

      <div className="flex flex-col gap-y-8">
        {/* Font Family Names */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="fontFamilyInput"
            className="font-whisper text-sm"
          >
            Font family name(s){" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              id="fontFamilyInput"
              type="text"
              value={familyInput}
              onChange={(e) =>
                setFamilyInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Type a font family name and press Enter"
              className="flex-1 border border-neutral-300 px-5 py-4 font-whisper text-sm placeholder:text-neutral-400"
            />
            <button
              type="button"
              onClick={addFontFamily}
              className="border border-black bg-white px-6 py-4 font-whisper text-sm font-medium transition-all duration-200 button-shadow hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Add
            </button>
          </div>
          {fontProduct.fontFamilies.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {fontProduct.fontFamilies.map((family) => (
                <span
                  key={family}
                  className="flex items-center gap-1.5 border border-neutral-300 bg-white px-3 py-1.5 font-whisper text-sm"
                >
                  {family}
                  <button
                    type="button"
                    onClick={() => removeFontFamily(family)}
                    className="text-neutral-400 hover:text-black"
                  >
                    <RiCloseLine className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Font Formats */}
        <div className="flex flex-col gap-y-2">
          <span className="font-whisper text-sm">
            Font format(s){" "}
            <span className="text-red-500">*</span>
          </span>
          <div className="flex flex-wrap gap-3">
            {FONT_FORMAT_OPTIONS.map(({ value, label }) => {
              const isSelected =
                fontProduct.fontFormats.includes(
                  value as FontProduct["fontFormats"][number]
                );
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    toggleFormat(
                      value as FontProduct["fontFormats"][number]
                    )
                  }
                  className={`border px-5 py-3 font-whisper text-sm transition-all duration-200 ${
                    isSelected
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white text-black hover:border-black"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Version or Release Date */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="versionOrDate"
            className="font-whisper text-sm"
          >
            Version or release date
            <span className="ml-1 text-neutral-400">
              (optional)
            </span>
          </label>
          <input
            id="versionOrDate"
            type="text"
            value={fontProduct.versionOrDate || ""}
            onChange={(e) =>
              updateFontProduct({
                versionOrDate: e.target.value,
              })
            }
            placeholder="e.g. v1.0, 2025-01-15"
            className="max-w-md border border-neutral-300 px-5 py-4 font-whisper text-sm placeholder:text-neutral-400"
          />
        </div>
      </div>
    </div>
  );
}
