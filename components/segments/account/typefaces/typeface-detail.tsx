"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useStudio } from "@/hooks/use-studio";
import type { TypefaceDetailProps } from "@/types/components";
import type { Font, StudioTypeface } from "@/types/studio";
import AddFontModal from "./add-font-modal";
import {
  BasicInformationSection,
  FilesAssetsSection,
  FontsListSection,
  TypefaceDetailHeader,
} from "./detail";

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
        designerIds: typeface.designerIds || [],
        fontLineText: typeface.fontLineText || "",
        displayFontId: typeface.displayFontId || "",
        fonts: typeface.fonts || [],
        headerImage: typeface.headerImage || "",
        heroLetter: typeface.heroLetter || "",
        specimen: typeface.specimen || "",
        eula: typeface.eula || "",
        variableFontFile: typeface.variableFontFile || "",
        published: typeface.published ?? false,
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

  const handleDesignerIdsChange = useCallback(
    (ids: string[]) => {
      setFormData((prev) => ({
        ...prev,
        designerIds: ids,
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

  const handleDisplayFontChange = useCallback(
    (fontId: string) => {
      setFormData((prev) => ({
        ...prev,
        displayFontId: fontId,
      }));
      setHasChanges(true);
    },
    []
  );

  const handleCloseFontModal = useCallback(() => {
    setIsFontModalOpen(false);
    setEditingFont(null);
  }, []);

  const handleStatusChange = useCallback(
    (status: string) => {
      setFormData((prev) => ({
        ...prev,
        published: status === "published",
      }));
      setHasChanges(true);
    },
    []
  );

  const handleTogglePublish = useCallback(async () => {
    if (!typeface) return;
    const newPublished = !formData.published;
    const updatedFormData = {
      ...formData,
      published: newPublished,
    };
    setFormData(updatedFormData);
    setIsSaving(true);
    try {
      await updateTypeface(typeface.id, {
        ...updatedFormData,
        characters:
          parseInt(
            updatedFormData.characters?.toString() || "0",
            10
          ) || 0,
      });
      setHasChanges(false);
    } catch (err) {
      console.error("Failed to save typeface:", err);
    } finally {
      setIsSaving(false);
    }
  }, [typeface, formData, updateTypeface]);

  const currentStatus = useMemo(
    () => (formData.published ? "published" : "draft"),
    [formData.published]
  );

  const handleSave = async () => {
    if (!typeface || !hasChanges) return;

    setIsSaving(true);
    try {
      await updateTypeface(typeface.id, {
        ...formData,
        characters:
          parseInt(
            formData.characters?.toString() || "0",
            10
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
    <div className="relative flex w-full flex-col gap-y-2 pb-20">
      <TypefaceDetailHeader
        typefaceName={typeface.name}
        status={currentStatus}
        hasChanges={hasChanges}
        isSaving={isSaving}
        isPublished={formData.published ?? false}
        onSave={handleSave}
        onStatusChange={handleStatusChange}
        onTogglePublish={handleTogglePublish}
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
        designerIds={formData.designerIds || []}
        studioDesigners={studio?.designers || []}
        onInputChange={handleInputChange}
        onCategoriesChange={handleCategoriesChange}
        onLanguagesChange={handleLanguagesChange}
        onDesignerIdsChange={handleDesignerIdsChange}
      />

      <FontsListSection
        fonts={formData.fonts || []}
        displayFontId={formData.displayFontId || ""}
        fontLineText={formData.fontLineText || ""}
        onRemoveFont={handleRemoveFont}
        onEditFont={handleEditFont}
        onAddFontClick={() => setIsFontModalOpen(true)}
        onDisplayFontChange={handleDisplayFontChange}
        onInputChange={handleInputChange}
      />

      <FilesAssetsSection
        studioId={studio?.id || ""}
        headerImage={formData.headerImage || ""}
        heroLetter={formData.heroLetter || ""}
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
        studioId={studio?.id || ""}
      />
    </div>
  );
}
