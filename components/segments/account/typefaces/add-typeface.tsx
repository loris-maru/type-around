"use client";

import { useState } from "react";
import { RiAddFill, RiCloseLine } from "react-icons/ri";
import { useStudio } from "@/hooks/use-studio";
import { StudioTypeface } from "@/types/studio";
import { generateUUID } from "@/utils/generate-uuid";
import { slugify } from "@/utils/slugify";

export default function AddTypeface() {
  const { studio, addTypeface } = useStudio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    hangeulName: "",
    description: "",
    category: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studio) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newTypeface: StudioTypeface = {
        id: generateUUID(),
        name: formData.name,
        hangeulName: formData.hangeulName || undefined,
        slug: slugify(formData.name),
        description: formData.description,
        category: formData.category
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        icon: "",
        fonts: [],
        characters: parseInt(formData.characters) || 0,
        releaseDate:
          formData.releaseDate ||
          new Date().toISOString().split("T")[0],
        studio: studio.name || studio.id,
      };

      await addTypeface(newTypeface);

      // Reset form and close modal
      setFormData({
        name: "",
        hangeulName: "",
        description: "",
        category: "",
        characters: "",
        releaseDate: "",
      });
      setIsModalOpen(false);
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  return (
    <>
      {/* Add Typeface Button */}
      <button
        type="button"
        onClick={handleOpenModal}
        className="relative w-full h-[320px] border border-neutral-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors"
      >
        <div className="relative font-ortank text-xl font-bold">
          Add typeface
        </div>
        <RiAddFill className="w-8 h-8 text-black" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseModal}
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
                onClick={handleCloseModal}
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
                  Name{" "}
                  <span className="text-red-500">*</span>
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

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Categories
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., Sans-serif, Display (comma separated)"
                />
              </div>

              {/* Characters */}
              <div>
                <label
                  htmlFor="characters"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Number of Characters
                </label>
                <input
                  type="number"
                  id="characters"
                  name="characters"
                  value={formData.characters}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., 2350"
                />
              </div>

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
                  {isSubmitting
                    ? "Adding..."
                    : "Add Typeface"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
