"use client";

import { useEffect, useState } from "react";
import {
  RiAddLine,
  RiCloseLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import type { AddPackageModalProps } from "@/types/components";
import type { Package } from "@/types/studio";
import { generateUUID } from "@/utils/generate-uuid";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-4 py-3 font-whisper text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black";
const labelClass =
  "mb-2 block font-normal font-whisper text-black text-sm";

export default function AddPackageModal({
  isOpen,
  onClose,
  onSave,
  editingPackage,
  fonts,
}: AddPackageModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fontIds, setFontIds] = useState<string[]>([]);
  const [printPrice, setPrintPrice] = useState(true);
  const [webPrice, setWebPrice] = useState(true);
  const [appPrice, setAppPrice] = useState(true);
  const [printPriceAmount, setPrintPriceAmount] =
    useState("");
  const [webPriceAmount, setWebPriceAmount] = useState("");
  const [appPriceAmount, setAppPriceAmount] = useState("");

  // Reset form when modal opens/closes or editing package changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen && editingPackage) {
      // Populate form with editing package data
      setName(editingPackage.name);
      setDescription(editingPackage.description);
      setFontIds(editingPackage.fontIds || []);
      setPrintPrice(editingPackage.printPrice ?? true);
      setWebPrice(editingPackage.webPrice ?? true);
      setAppPrice(editingPackage.appPrice ?? true);
      setPrintPriceAmount(
        String(editingPackage.printPriceAmount ?? 0)
      );
      setWebPriceAmount(
        String(editingPackage.webPriceAmount ?? 0)
      );
      setAppPriceAmount(
        String(editingPackage.appPriceAmount ?? 0)
      );
    } else if (isOpen && !editingPackage) {
      // Reset form for new package
      setName("");
      setDescription("");
      setFontIds([]);
      setPrintPrice(true);
      setWebPrice(true);
      setAppPrice(true);
      setPrintPriceAmount("");
      setWebPriceAmount("");
      setAppPriceAmount("");
    }
  }, [isOpen, editingPackage]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleAddFont = (fontId: string) => {
    if (!fontIds.includes(fontId)) {
      setFontIds((prev) => [...prev, fontId]);
    }
  };

  const handleRemoveFont = (fontId: string) => {
    setFontIds((prev) =>
      prev.filter((id) => id !== fontId)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg: Package = {
      id: editingPackage?.id || generateUUID(),
      name,
      description,
      fontIds,
      printPrice,
      webPrice,
      appPrice,
      printPriceAmount: parseFloat(printPriceAmount) || 0,
      webPriceAmount: parseFloat(webPriceAmount) || 0,
      appPriceAmount: parseFloat(appPriceAmount) || 0,
    };
    onSave(pkg);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const availableFonts = fonts.filter(
    (f) => !fontIds.includes(f.id)
  );
  const selectedFonts = fonts.filter((f) =>
    fontIds.includes(f.id)
  );

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white">
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            {editingPackage
              ? "Edit Package"
              : "Add Package"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1 transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-6"
        >
          {/* Package name */}
          <div>
            <label
              htmlFor="packageName"
              className={labelClass}
            >
              Package name
            </label>
            <input
              type="text"
              id="packageName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="e.g., Complete Family"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="packageDescription"
              className={labelClass}
            >
              Description
            </label>
            <textarea
              id="packageDescription"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className={`${inputClass} min-h-[80px] resize-y`}
              placeholder="Describe this package..."
              rows={3}
            />
          </div>

          {/* Fonts */}
          <div>
            <label className={labelClass}>Fonts</label>
            <div className="space-y-3">
              {/* Selected fonts */}
              {selectedFonts.length > 0 && (
                <div className="rounded-lg border border-neutral-200 p-3">
                  <p className="mb-2 font-whisper text-neutral-500 text-xs">
                    Selected fonts
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFonts.map((font) => (
                      <span
                        key={font.id}
                        className="flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 font-whisper text-sm"
                      >
                        {font.styleName}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveFont(font.id)
                          }
                          aria-label={`Remove ${font.styleName}`}
                          className="rounded p-0.5 hover:bg-neutral-200"
                        >
                          <RiDeleteBinLine className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Add from list */}
              <div className="rounded-lg border border-neutral-200 p-3">
                <p className="mb-2 font-whisper text-neutral-500 text-xs">
                  Add from fonts list
                </p>
                {availableFonts.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {availableFonts.map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() =>
                          handleAddFont(font.id)
                        }
                        className="flex items-center gap-1 rounded-md border border-neutral-300 bg-white px-2 py-1 font-whisper text-sm transition-colors hover:border-black hover:bg-neutral-50"
                      >
                        <RiAddLine className="h-3.5 w-3.5" />
                        {font.styleName}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="font-whisper text-neutral-400 text-sm">
                    {fonts.length === 0
                      ? "No fonts available. Add fonts in the Fonts section first."
                      : "All fonts have been added to this package."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="mb-3 font-bold font-ortank text-base text-black">
              Price
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-2 flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={printPrice}
                    onChange={(e) =>
                      setPrintPrice(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
                  />
                  <span className="font-whisper text-sm">
                    Print
                  </span>
                </label>
                {printPrice && (
                  <div className="relative">
                    <input
                      type="number"
                      value={printPriceAmount}
                      onChange={(e) =>
                        setPrintPriceAmount(e.target.value)
                      }
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border border-neutral-300 px-4 py-3 pr-10 font-whisper text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="0"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-whisper text-neutral-500 text-sm">
                      ₩
                    </span>
                  </div>
                )}
              </div>
              <div>
                <label className="mb-2 flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={webPrice}
                    onChange={(e) =>
                      setWebPrice(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
                  />
                  <span className="font-whisper text-sm">
                    Web
                  </span>
                </label>
                {webPrice && (
                  <div className="relative">
                    <input
                      type="number"
                      value={webPriceAmount}
                      onChange={(e) =>
                        setWebPriceAmount(e.target.value)
                      }
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border border-neutral-300 px-4 py-3 pr-10 font-whisper text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="0"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-whisper text-neutral-500 text-sm">
                      ₩
                    </span>
                  </div>
                )}
              </div>
              <div>
                <label className="mb-2 flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={appPrice}
                    onChange={(e) =>
                      setAppPrice(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
                  />
                  <span className="font-whisper text-sm">
                    App
                  </span>
                </label>
                {appPrice && (
                  <div className="relative">
                    <input
                      type="number"
                      value={appPriceAmount}
                      onChange={(e) =>
                        setAppPriceAmount(e.target.value)
                      }
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border border-neutral-300 px-4 py-3 pr-10 font-whisper text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="0"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-whisper text-neutral-500 text-sm">
                      ₩
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex w-full items-center justify-center rounded-lg bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {editingPackage
                ? "Save Changes"
                : "Add Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
