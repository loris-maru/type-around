"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useStudio } from "@/hooks/use-studio";
import type {
  TypefaceDetailProps,
  TypefaceVersion,
} from "@/types/components";
import type { Font, StudioTypeface } from "@/types/studio";
import { slugify } from "@/utils/slugify";
import EulaGeneratorModal from "../eula-generator/eula-generator-modal";
import AddFontModal from "./add-font-modal";
import AddVersionModal from "./add-version-modal";
import {
  AssetsSection,
  BasicInformationSection,
  EulaSection,
  FeedbacksSection,
  FontsListSection,
  SpecimenSection,
  TypefaceDetailHeader,
  VersionsListSection,
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
  const [isVersionModalOpen, setIsVersionModalOpen] =
    useState(false);
  const [isEulaModalOpen, setIsEulaModalOpen] =
    useState(false);
  const [editingVersion, setEditingVersion] =
    useState<TypefaceVersion | null>(null);
  const [versions, setVersions] = useState<
    TypefaceVersion[]
  >([
    {
      id: "version-1",
      title: "",
      versionNumber: "1",
      description: "",
      coverImage: "",
      glyphSetCurrent: 0,
      glyphSetFinal: 0,
      features: "",
      newWeightCurrent: 0,
      newWeightFinal: 0,
      newStyleCurrent: 0,
      newStyleFinal: 0,
      corrections: "",
    },
  ]);
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
        galleryImages: typeface.galleryImages || [],
        visionUsage: typeface.visionUsage || "",
        visionContrast: typeface.visionContrast || "",
        visionWidth: typeface.visionWidth || "",
        visionPlayful: typeface.visionPlayful || "",
        visionFrame: typeface.visionFrame || "",
        visionSerif: typeface.visionSerif || "",
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

  const handleTypefaceVisionChange = useCallback(
    (vision: {
      usage?: string;
      contrast?: string;
      width?: string;
      playful?: string;
      frame?: string;
      serif?: string;
    }) => {
      setFormData((prev) => ({
        ...prev,
        visionUsage: vision.usage ?? prev.visionUsage ?? "",
        visionContrast:
          vision.contrast ?? prev.visionContrast ?? "",
        visionWidth: vision.width ?? prev.visionWidth ?? "",
        visionPlayful:
          vision.playful ?? prev.visionPlayful ?? "",
        visionFrame: vision.frame ?? prev.visionFrame ?? "",
        visionSerif: vision.serif ?? prev.visionSerif ?? "",
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

  const handleGalleryImagesChange = useCallback(
    (images: string[]) => {
      setFormData((prev) => ({
        ...prev,
        galleryImages: images,
      }));
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

  // ── Version handlers ──
  const handleSaveVersion = useCallback(
    (version: TypefaceVersion) => {
      setVersions((prev) => {
        const idx = prev.findIndex(
          (v) => v.id === version.id
        );
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = version;
          return updated;
        }
        return [...prev, version];
      });
      setHasChanges(true);
    },
    []
  );

  const handleEditVersion = useCallback(
    (version: TypefaceVersion) => {
      setEditingVersion(version);
      setIsVersionModalOpen(true);
    },
    []
  );

  const handleRemoveVersion = useCallback(
    (versionId: string) => {
      setVersions((prev) =>
        prev.filter((v) => v.id !== versionId)
      );
      setHasChanges(true);
    },
    []
  );

  const handleCloseVersionModal = useCallback(() => {
    setIsVersionModalOpen(false);
    setEditingVersion(null);
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
    <div className="relative flex w-full flex-col gap-y-28 pb-20">
      <TypefaceDetailHeader
        typefaceName={typeface.name}
        status={currentStatus}
        hasChanges={hasChanges}
        isSaving={isSaving}
        isPublished={formData.published ?? false}
        viewHref={`/studio/${slugify(studio?.name)}/typeface/${typeface.slug}`}
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
        typefaceVision={{
          usage: formData.visionUsage || "",
          contrast: formData.visionContrast || "",
          width: formData.visionWidth || "",
          playful: formData.visionPlayful || "",
          frame: formData.visionFrame || "",
          serif: formData.visionSerif || "",
        }}
        designerIds={formData.designerIds || []}
        studioDesigners={studio?.designers || []}
        onInputChange={handleInputChange}
        onCategoriesChange={handleCategoriesChange}
        onLanguagesChange={handleLanguagesChange}
        onTypefaceVisionChange={handleTypefaceVisionChange}
        onDesignerIdsChange={handleDesignerIdsChange}
      />

      <VersionsListSection
        versions={versions}
        onAddVersionClick={() =>
          setIsVersionModalOpen(true)
        }
        onEditVersion={handleEditVersion}
        onRemoveVersion={handleRemoveVersion}
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

      <EulaSection
        studioId={studio?.id || ""}
        eula={formData.eula || ""}
        onEulaChange={handleFileChange("eula")}
        onOpenEulaGenerator={() => setIsEulaModalOpen(true)}
      />

      <SpecimenSection
        studioId={studio?.id || ""}
        typefaceSlug={typefaceSlug}
        specimen={formData.specimen || ""}
        onSpecimenChange={handleFileChange("specimen")}
      />

      <AssetsSection
        studioId={studio?.id || ""}
        heroLetter={formData.heroLetter || ""}
        variableFontFile={formData.variableFontFile || ""}
        galleryImages={formData.galleryImages || []}
        onHeroLetterChange={handleFileChange("heroLetter")}
        onVariableFontFileChange={handleFileChange(
          "variableFontFile"
        )}
        onGalleryImagesChange={handleGalleryImagesChange}
      />

      <FeedbacksSection studioId={studio?.id || ""} />

      <AddFontModal
        isOpen={isFontModalOpen}
        onClose={handleCloseFontModal}
        onSave={handleSaveFont}
        editingFont={editingFont}
        studioId={studio?.id || ""}
      />

      <AddVersionModal
        isOpen={isVersionModalOpen}
        onClose={handleCloseVersionModal}
        onSave={handleSaveVersion}
        editingVersion={editingVersion}
        studioId={studio?.id || ""}
      />

      <EulaGeneratorModal
        isOpen={isEulaModalOpen}
        onClose={() => setIsEulaModalOpen(false)}
        studioId={studio?.id || ""}
      />
    </div>
  );
}
