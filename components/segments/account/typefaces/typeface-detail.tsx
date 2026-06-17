"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AddFontModal from "@/components/modals/modal-add-font";
import AddPackageModal from "@/components/modals/modal-add-package";
import AddVersionModal from "@/components/modals/modal-add-version";
import EulaGeneratorModal from "@/components/modals/modal-eula-generator";
import { useStudio } from "@/hooks/use-studio";
import type {
  TypefaceDetailProps,
  TypefaceVersion,
} from "@/types/components";
import type { TypefaceLayoutItem } from "@/types/layout-typeface";
import type {
  Font,
  GlyphCollection,
  Package,
  StudioTypeface,
  TypefaceContributor,
  TypeTesterConfig,
} from "@/types/studio";
import { normalizeReleaseYear } from "@/utils/release-year";
import { slugify } from "@/utils/slugify";
import ChangesSavedPill from "../changes-saved-pill";
import CharacterSetSection from "./detail/character-set-section";
import TypeTesterSection from "./detail/type-tester-section";
import {
  BasicInformationSection,
  DesignersSection,
  EulaSection,
  FontsListSection,
  PackagesListSection,
  ShopSection,
  SpecimenSection,
  TypefaceDetailHeader,
  TypefacePageSection,
  VersionsListSection,
} from "./detail";

export default function TypefaceDetail({
  typefaceSlug,
  activeSubsection,
}: TypefaceDetailProps) {
  const { studio, isLoading, updateTypeface } = useStudio();
  const [isSaving, setIsSaving] = useState(false);
  const [isFontModalOpen, setIsFontModalOpen] =
    useState(false);
  const [editingFont, setEditingFont] =
    useState<Font | null>(null);
  const [isPackageModalOpen, setIsPackageModalOpen] =
    useState(false);
  const [editingPackage, setEditingPackage] =
    useState<Package | null>(null);
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
  const [showLayoutSaved, setShowLayoutSaved] =
    useState(false);
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

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
        releaseDate: normalizeReleaseYear(
          typeface.releaseDate
        ),
        description: typeface.description,
        supportedLanguages:
          typeface.supportedLanguages || [],
        designerIds: typeface.designerIds || [],
        contributors:
          (
            typeface as StudioTypeface & {
              contributors?: TypefaceContributor[];
            }
          ).contributors ?? [],
        glyphCollections:
          (
            typeface as StudioTypeface & {
              glyphCollections?: GlyphCollection[];
            }
          ).glyphCollections ?? [],
        typeTesterConfig: (
          typeface as StudioTypeface & {
            typeTesterConfig?: TypeTesterConfig;
          }
        ).typeTesterConfig,
        fontLineText: typeface.fontLineText || "",
        displayFontId: typeface.displayFontId || "",
        typefaceCardDisplayFontId:
          (
            typeface as StudioTypeface & {
              typefaceCardDisplayFontId?: string;
            }
          ).typefaceCardDisplayFontId || "",
        typefaceCardContent:
          (
            typeface as StudioTypeface & {
              typefaceCardContent?: string;
            }
          ).typefaceCardContent || "",
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
        printPrice:
          (
            typeface as StudioTypeface & {
              printPrice?: number;
            }
          ).printPrice ?? 0,
        webPrice:
          (
            typeface as StudioTypeface & {
              webPrice?: number;
            }
          ).webPrice ?? 0,
        appPrice:
          (
            typeface as StudioTypeface & {
              appPrice?: number;
            }
          ).appPrice ?? 0,
        packages:
          (
            typeface as StudioTypeface & {
              packages?: Package[];
            }
          ).packages ?? [],
        typefacePageLayout:
          (
            typeface as StudioTypeface & {
              typefacePageLayout?: TypefaceLayoutItem[];
            }
          ).typefacePageLayout ?? [],
        typefacePageBackground: (
          typeface as StudioTypeface & {
            typefacePageBackground?: {
              type: "color" | "gradient" | "image";
              color?: string;
              gradient?: { from: string; to: string };
              image?: string;
            };
          }
        ).typefacePageBackground ?? {
          type: "color",
          color: "#ffffff",
        },
        pageTitleFont:
          (
            typeface as StudioTypeface & {
              pageTitleFont?: string;
            }
          ).pageTitleFont || "",
        pageTextFont:
          (
            typeface as StudioTypeface & {
              pageTextFont?: string;
            }
          ).pageTextFont || "",
        pageTitleFontSameAsText:
          (
            typeface as StudioTypeface & {
              pageTitleFontSameAsText?: boolean;
            }
          ).pageTitleFontSameAsText ?? false,
        pageTextFontSameAsTitle:
          (
            typeface as StudioTypeface & {
              pageTextFontSameAsTitle?: boolean;
            }
          ).pageTextFontSameAsTitle ?? false,
      });
      setHasChanges(false);
    }
  }, [typeface]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to top when subsection changes
  useEffect(() => {
    if (!typeface) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeSubsection, typeface]);

  const saveToFirebase = useCallback(
    async (dataToSave: Partial<StudioTypeface>) => {
      if (!typeface) return;
      setIsSaving(true);
      try {
        await updateTypeface(typeface.id, {
          ...dataToSave,
          ...(dataToSave.releaseDate !== undefined
            ? {
                releaseDate: normalizeReleaseYear(
                  String(dataToSave.releaseDate)
                ),
              }
            : {}),
          characters: dataToSave.characters ?? "",
        });
        setHasChanges(false);
      } catch (err) {
        console.error("Failed to save typeface:", err);
      } finally {
        setIsSaving(false);
      }
    },
    [typeface, updateTypeface]
  );

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      const numValue =
        name === "printPrice" ||
        name === "webPrice" ||
        name === "appPrice"
          ? parseFloat(value) || 0
          : value;
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
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

  const handleContributorsChange = useCallback(
    (contributors: TypefaceContributor[]) => {
      setFormData((prev) => ({
        ...prev,
        contributors,
      }));
      setHasChanges(true);
    },
    []
  );

  const handleGlyphCollectionsChange = useCallback(
    (glyphCollections: GlyphCollection[]) => {
      setFormData((prev) => ({
        ...prev,
        glyphCollections,
      }));
      setHasChanges(true);
    },
    []
  );

  const handleTypeTesterConfigChange = useCallback(
    (typeTesterConfig: TypeTesterConfig) => {
      setFormData((prev) => ({
        ...prev,
        typeTesterConfig,
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

  const handleSaveFont = useCallback(
    (font: Font) => {
      const prev = formDataRef.current;
      const existingFonts = prev.fonts || [];
      const existingIndex = existingFonts.findIndex(
        (f) => f.id === font.id
      );
      const updatedFonts =
        existingIndex >= 0
          ? (() => {
              const next = [...existingFonts];
              next[existingIndex] = font;
              return next;
            })()
          : [...existingFonts, font];
      const next = { ...prev, fonts: updatedFonts };
      setFormData(next);
      saveToFirebase(next);
    },
    [saveToFirebase]
  );

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

  // ── Package handlers ──
  const handleSavePackage = useCallback(
    (pkg: Package) => {
      const prev = formDataRef.current;
      const existing = prev.packages || [];
      const idx = existing.findIndex(
        (p) => p.id === pkg.id
      );
      const updated =
        idx >= 0
          ? existing.map((p) => (p.id === pkg.id ? pkg : p))
          : [...existing, pkg];
      const next = { ...prev, packages: updated };
      setFormData(next);
      saveToFirebase(next);
      setIsPackageModalOpen(false);
      setEditingPackage(null);
    },
    [saveToFirebase]
  );

  const handleEditPackageClick = useCallback(
    (pkg: Package) => {
      setEditingPackage(pkg);
      setIsPackageModalOpen(true);
    },
    []
  );

  const handleRemovePackage = useCallback(
    (packageId: string) => {
      setFormData((prev) => ({
        ...prev,
        packages: (prev.packages || []).filter(
          (p) => p.id !== packageId
        ),
      }));
      setHasChanges(true);
    },
    []
  );

  const handleClosePackageModal = useCallback(() => {
    setIsPackageModalOpen(false);
    setEditingPackage(null);
  }, []);

  const handleTypefacePageLayoutChange = useCallback(
    async (layout: TypefaceLayoutItem[]) => {
      const next = {
        ...formDataRef.current,
        typefacePageLayout: layout,
      };
      setFormData(next);
      await saveToFirebase(next);
      setShowLayoutSaved(true);
      setTimeout(() => setShowLayoutSaved(false), 2000);
    },
    [saveToFirebase]
  );

  const handlePageBackgroundChange = useCallback(
    (value: {
      type: "color" | "gradient" | "image";
      color?: string;
      gradient?: { from: string; to: string };
      image?: string;
    }) => {
      setFormData((prev) => {
        const next = { ...prev };
        (
          next as Record<string, unknown>
        ).typefacePageBackground = {
          type: value.type,
          color: value.color ?? "#ffffff",
          gradient: value.gradient,
          image: value.image ?? "",
        };
        return next;
      });
      setHasChanges(true);
    },
    []
  );

  const handlePageFontChange = useCallback(
    (field: string) => (value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setHasChanges(true);
    },
    []
  );

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
        releaseDate: normalizeReleaseYear(
          String(updatedFormData.releaseDate ?? "")
        ),
        characters: updatedFormData.characters ?? "",
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
        releaseDate: normalizeReleaseYear(
          String(formData.releaseDate ?? "")
        ),
        characters: formData.characters ?? "",
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
    <div className="relative flex w-full flex-col gap-y-8 pb-20">
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

      {activeSubsection === "information" && (
        <BasicInformationSection
          studioId={studio?.id || ""}
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
          onInputChange={handleInputChange}
          onCategoriesChange={handleCategoriesChange}
          onLanguagesChange={handleLanguagesChange}
          onTypefaceVisionChange={
            handleTypefaceVisionChange
          }
          fonts={formData.fonts || []}
          displayFontId={formData.displayFontId || ""}
          fontLineText={formData.fontLineText || ""}
          onDisplayFontChange={handleDisplayFontChange}
          heroLetter={formData.heroLetter || ""}
          variableFontFile={formData.variableFontFile || ""}
          onHeroLetterChange={handleFileChange(
            "heroLetter"
          )}
          onVariableFontFileChange={handleFileChange(
            "variableFontFile"
          )}
        />
      )}

      {activeSubsection === "designers" && (
        <DesignersSection
          contributors={
            (
              formData as StudioTypeface & {
                contributors?: TypefaceContributor[];
              }
            ).contributors ?? []
          }
          onContributorsChange={handleContributorsChange}
        />
      )}

      {activeSubsection === "typeface-page" && (
        <TypefacePageSection
          typefacePageLayout={
            (
              formData as StudioTypeface & {
                typefacePageLayout?: TypefaceLayoutItem[];
              }
            ).typefacePageLayout ?? []
          }
          onLayoutChange={handleTypefacePageLayoutChange}
          typefacePageBackground={
            (
              formData as StudioTypeface & {
                typefacePageBackground?: {
                  type: "color" | "gradient" | "image";
                  color?: string;
                  gradient?: { from: string; to: string };
                  image?: string;
                };
              }
            ).typefacePageBackground
          }
          onPageBackgroundChange={
            handlePageBackgroundChange
          }
          pageTitleFont={
            ((formData as Record<string, unknown>)
              .pageTitleFont as string) ?? ""
          }
          pageTextFont={
            ((formData as Record<string, unknown>)
              .pageTextFont as string) ?? ""
          }
          pageTitleFontSameAsText={
            ((formData as Record<string, unknown>)
              .pageTitleFontSameAsText as boolean) ?? false
          }
          pageTextFontSameAsTitle={
            ((formData as Record<string, unknown>)
              .pageTextFontSameAsTitle as boolean) ?? false
          }
          onPageTitleFontChange={
            handlePageFontChange("pageTitleFont") as (
              url: string
            ) => void
          }
          onPageTextFontChange={
            handlePageFontChange("pageTextFont") as (
              url: string
            ) => void
          }
          onPageTitleFontSameAsTextChange={
            handlePageFontChange(
              "pageTitleFontSameAsText"
            ) as (value: boolean) => void
          }
          onPageTextFontSameAsTitleChange={
            handlePageFontChange(
              "pageTextFontSameAsTitle"
            ) as (value: boolean) => void
          }
          studioId={studio?.id || ""}
          typefaceId={typeface?.id || ""}
          typefaceHangeulName={
            formData.hangeulName?.trim() ||
            formData.name?.trim() ||
            typeface.name
          }
          typefaceFonts={(formData.fonts || []).map(
            (f) => ({
              id: f.id,
              styleName: f.styleName,
              weight: f.weight,
            })
          )}
          studioTypefaces={(studio?.typefaces || []).map(
            (t) => ({
              slug: t.slug,
              name: t.name,
            })
          )}
        />
      )}

      {activeSubsection === "versions" && (
        <VersionsListSection
          versions={versions}
          onAddVersionClick={() =>
            setIsVersionModalOpen(true)
          }
          onEditVersion={handleEditVersion}
          onRemoveVersion={handleRemoveVersion}
        />
      )}

      {activeSubsection === "fonts" && (
        <div className="flex flex-col gap-y-10">
          <FontsListSection
            fonts={formData.fonts || []}
            onRemoveFont={handleRemoveFont}
            onEditFont={handleEditFont}
            onAddFontClick={() => setIsFontModalOpen(true)}
          />
          <ShopSection
            printPrice={String(formData.printPrice ?? 0)}
            webPrice={String(formData.webPrice ?? 0)}
            appPrice={String(formData.appPrice ?? 0)}
            onInputChange={handleInputChange}
          />
        </div>
      )}

      {activeSubsection === "packages" && (
        <PackagesListSection
          packages={formData.packages || []}
          fonts={formData.fonts || []}
          onAddPackageClick={() => {
            setEditingPackage(null);
            setIsPackageModalOpen(true);
          }}
          onEditPackageClick={handleEditPackageClick}
          onSavePackage={handleSavePackage}
          onRemovePackage={handleRemovePackage}
        />
      )}

      {activeSubsection === "eula" && (
        <EulaSection
          studioId={studio?.id || ""}
          eula={formData.eula || ""}
          onEulaChange={handleFileChange("eula")}
          onOpenEulaGenerator={() =>
            setIsEulaModalOpen(true)
          }
        />
      )}

      {activeSubsection === "specimen" && (
        <SpecimenSection
          studioId={studio?.id || ""}
          typefaceSlug={typefaceSlug}
          specimen={formData.specimen || ""}
          onSpecimenChange={handleFileChange("specimen")}
        />
      )}

      {activeSubsection === "character-set" && (
        <CharacterSetSection
          glyphCollections={
            (
              formData as StudioTypeface & {
                glyphCollections?: GlyphCollection[];
              }
            ).glyphCollections ?? []
          }
          onGlyphCollectionsChange={
            handleGlyphCollectionsChange
          }
        />
      )}

      {activeSubsection === "type-tester" && (
        <TypeTesterSection
          typeTesterConfig={
            (
              formData as StudioTypeface & {
                typeTesterConfig?: TypeTesterConfig;
              }
            ).typeTesterConfig ?? {
              col1: {
                fontSize: 48,
                lineHeight: 1.2,
                fontId: "",
                content: "",
              },
              col2: {
                slots: [
                  {
                    fontId: "",
                    content: "",
                    fontSize: 48,
                    lineHeight: 1.2,
                  },
                  {
                    fontId: "",
                    content: "",
                    fontSize: 48,
                    lineHeight: 1.2,
                  },
                ],
              },
              col3: {
                slots: [
                  {
                    fontId: "",
                    content: "",
                    fontSize: 48,
                    lineHeight: 1.2,
                  },
                  {
                    fontId: "",
                    content: "",
                    fontSize: 48,
                    lineHeight: 1.2,
                  },
                  {
                    fontId: "",
                    content: "",
                    fontSize: 48,
                    lineHeight: 1.2,
                  },
                ],
              },
            }
          }
          onTypeTesterConfigChange={
            handleTypeTesterConfigChange
          }
          fonts={formData.fonts || []}
        />
      )}

      <AddFontModal
        isOpen={isFontModalOpen}
        onClose={handleCloseFontModal}
        onSave={handleSaveFont}
        editingFont={editingFont}
        studioId={studio?.id || ""}
        defaultPrices={{
          printPrice: formData.printPrice ?? 0,
          webPrice: formData.webPrice ?? 0,
          appPrice: formData.appPrice ?? 0,
        }}
      />

      <AddVersionModal
        isOpen={isVersionModalOpen}
        onClose={handleCloseVersionModal}
        onSave={handleSaveVersion}
        editingVersion={editingVersion}
        studioId={studio?.id || ""}
      />

      <AddPackageModal
        isOpen={isPackageModalOpen}
        onClose={handleClosePackageModal}
        onSave={handleSavePackage}
        editingPackage={editingPackage}
        fonts={formData.fonts || []}
      />

      <EulaGeneratorModal
        isOpen={isEulaModalOpen}
        onClose={() => setIsEulaModalOpen(false)}
        studioId={studio?.id || ""}
      />

      <ChangesSavedPill show={showLayoutSaved} />
    </div>
  );
}
