"use client";

import { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import type { StudioTypeface } from "@/types/studio";
import type { AddTypefaceModalProps } from "@/types/components";
import { generateUUID } from "@/utils/generate-uuid";
import { slugify } from "@/utils/slugify";
import TagInput from "@/components/global/tag-input";

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
        characters: parseInt(formData.characters) || 0,
        releaseDate:
          formData.releaseDate ||
          new Date().toISOString().split("T")[0],
        studio: studio.name || studio.id,
        status: "in progress",
        published: false,
        supportedLanguages: [],
        headerImage: "",
        heroLetter: "",
        specimen: "",
        eula: "",
        variableFontFile: "",
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
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="font-ortank text-xl font-bold">
            Add New Typeface
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-700 mb-1"
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
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="e.g., Arvana"
            />
          </div>

          {/* Hangeul Name */}
          <div>
            <label
              htmlFor="hangeulName"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Hangeul Name
            </label>
            <input
              type="text"
              id="hangeulName"
              name="hangeulName"
              value={formData.hangeulName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="e.g., 아르바나"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
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
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !formData.name}
              className="w-full py-3 bg-black text-white font-whisper font-medium rounded-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Adding..." : "Add Typeface"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
