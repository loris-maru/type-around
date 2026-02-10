"use client";

import { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import TagInput from "@/components/global/tag-input";
import type { AddTypefaceModalProps } from "@/types/components";
import type { StudioTypeface } from "@/types/studio";
import { generateUUID } from "@/utils/generate-uuid";
import { slugify } from "@/utils/slugify";

export default function AddTypefaceModal({
  isOpen,
  onClose,
  studio,
  onAddTypeface,
}: AddTypefaceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    hangeulName: "",
    description: "",
    categories: [] as string[],
    characters: "",
    releaseDate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoriesChange = (categories: string[]) => {
    setFormData((prev) => ({ ...prev, categories }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      hangeulName: "",
      description: "",
      categories: [],
      characters: "",
      releaseDate: "",
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studio) {
      setError("No studio loaded. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newTypeface: StudioTypeface = {
        id: generateUUID(),
        name: formData.name,
        hangeulName: formData.hangeulName || undefined,
        slug: slugify(formData.name),
        description: formData.description,
        category: formData.categories,
        icon: "",
        fonts: [],
        characters: parseInt(formData.characters, 10) || 0,
        releaseDate:
          formData.releaseDate ||
          new Date().toISOString().split("T")[0],
        studio: studio.name || studio.id,
        status: "in progress",
        published: false,
        designerIds: [],
        fontLineText: "",
        displayFontId: "",
        supportedLanguages: [],
        headerImage: "",
        heroLetter: "",
        specimen: "",
        eula: "",
        variableFontFile: "",
        galleryImages: [],
      };

      await onAddTypeface(newTypeface);
      resetForm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add typeface"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
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

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            Add New Typeface
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="rounded-lg p-1 transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-6"
        >
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block font-normal font-whisper text-black text-sm"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., Arvana"
            />
          </div>

          {/* Hangeul Name */}
          <div>
            <label
              htmlFor="hangeulName"
              className="mb-2 block font-normal font-whisper text-black text-sm"
            >
              Hangeul Name
            </label>
            <input
              type="text"
              id="hangeulName"
              name="hangeulName"
              value={formData.hangeulName}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., 아르바나"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block font-normal font-whisper text-black text-sm"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Brief description of the typeface..."
            />
          </div>

          {/* Categories */}
          <TagInput
            label="Categories"
            value={formData.categories}
            onChange={handleCategoriesChange}
            placeholder="Type a category and press Enter..."
          />

          {/* Release Date */}
          <div>
            <label
              htmlFor="releaseDate"
              className="mb-2 block font-normal font-whisper text-black text-sm"
            >
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !formData.name}
              className="w-full rounded-lg bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {isSubmitting ? "Adding..." : "Add Typeface"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
