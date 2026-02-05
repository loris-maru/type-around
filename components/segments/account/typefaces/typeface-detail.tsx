"use client";

import { useState, useCallback, useEffect } from "react";
import { useStudio } from "@/hooks/use-studio";
import { StudioTypeface, Font } from "@/types/studio";
import AddFontModal from "./add-font-modal";
import {
  TypefaceDetailHeader,
  BasicInformationSection,
  FontsListSection,
  FilesAssetsSection,
} from "./detail";

interface TypefaceDetailProps {
  typefaceSlug: string;
}

export default function TypefaceDetail({
  typefaceSlug,
}: TypefaceDetailProps) {
  const { studio, isLoading, updateTypeface } = useStudio();
  const [isSaving, setIsSaving] = useState(false);
  const [isFontModalOpen, setIsFontModalOpen] =
    useState(false);
  const [editingFont, setEditingFont] =
    useState<Font | null>(null);
  const [formData, setFormData] = useState<
    Partial<StudioTypeface>
  >({});
  const [hasChanges, setHasChanges] = useState(false);

  const typeface = studio?.typefaces.find(
    (t) => t.slug === typefaceSlug
  );

  // Initialize form data when typeface loads
  useEffect(() => {
    if (typeface) {
      setFormData({
        name: typeface.name,
        hangeulName: typeface.hangeulName || "",
        category: typeface.category || [],
        characters: typeface.characters,
        releaseDate: typeface.releaseDate,
        description: typeface.description,
        supportedLanguages:
          typeface.supportedLanguages || [],
        fonts: typeface.fonts || [],
        headerImage: typeface.headerImage || "",
        specimen: typeface.specimen || "",
        eula: typeface.eula || "",
        variableFontFile: typeface.variableFontFile || "",
      });
      setHasChanges(false);
    }
  }, [typeface]);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setHasChanges(true);
    },
    []
  );

  const handleCategoriesChange = useCallback(
    (values: string[]) => {
      setFormData((prev) => ({
        ...prev,
        category: values,
      }));
      setHasChanges(true);
    },
    []
  );

  const handleLanguagesChange = useCallback(
    (values: string[]) => {
      setFormData((prev) => ({
        ...prev,
        supportedLanguages: values,
      }));
      setHasChanges(true);
    },
    []
  );

  const handleFileChange = useCallback(
    (field: string) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setHasChanges(true);
    },
    []
  );

  const handleSaveFont = useCallback((font: Font) => {
    setFormData((prev) => {
      const existingFonts = prev.fonts || [];
      const existingIndex = existingFonts.findIndex(
        (f) => f.id === font.id
      );

      if (existingIndex >= 0) {
        // Edit existing font
        const updatedFonts = [...existingFonts];
        updatedFonts[existingIndex] = font;
        return { ...prev, fonts: updatedFonts };
      } else {
        // Add new font
        return { ...prev, fonts: [...existingFonts, font] };
      }
    });
    setHasChanges(true);
  }, []);

  const handleEditFont = useCallback((font: Font) => {
    setEditingFont(font);
    setIsFontModalOpen(true);
  }, []);

  const handleRemoveFont = useCallback((fontId: string) => {
    setFormData((prev) => ({
      ...prev,
      fonts: (prev.fonts || []).filter(
        (f) => f.id !== fontId
      ),
    }));
    setHasChanges(true);
  }, []);

  const handleCloseFontModal = useCallback(() => {
    setIsFontModalOpen(false);
    setEditingFont(null);
  }, []);

  const handleSave = async () => {
    if (!typeface || !hasChanges) return;

    setIsSaving(true);
    try {
      await updateTypeface(typeface.id, {
        ...formData,
        characters:
          parseInt(
            formData.characters?.toString() || "0"
          ) || 0,
      });
      setHasChanges(false);
    } catch (err) {
      console.error("Failed to save typeface:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  if (!typeface) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-neutral-500">
          Typeface not found
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full pb-20">
      <TypefaceDetailHeader
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={handleSave}
      />

      <BasicInformationSection
        name={formData.name || ""}
        hangeulName={formData.hangeulName || ""}
        categories={formData.category || []}
        characters={formData.characters || ""}
        releaseDate={formData.releaseDate || ""}
        description={formData.description || ""}
        supportedLanguages={
          formData.supportedLanguages || []
        }
        onInputChange={handleInputChange}
        onCategoriesChange={handleCategoriesChange}
        onLanguagesChange={handleLanguagesChange}
      />

      <FontsListSection
        fonts={formData.fonts || []}
        onRemoveFont={handleRemoveFont}
        onEditFont={handleEditFont}
        onAddFontClick={() => setIsFontModalOpen(true)}
      />

      <FilesAssetsSection
        headerImage={formData.headerImage || ""}
        specimen={formData.specimen || ""}
        eula={formData.eula || ""}
        variableFontFile={formData.variableFontFile || ""}
        onFileChange={handleFileChange}
      />

      <AddFontModal
        isOpen={isFontModalOpen}
        onClose={handleCloseFontModal}
        onSave={handleSaveFont}
        editingFont={editingFont}
      />
    </div>
  );
}
