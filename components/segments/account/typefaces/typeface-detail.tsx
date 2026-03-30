"use client";

import { useLenis } from "lenis/react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
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
import { TYPEFACE_SECTIONS } from "@/constant/TYPEFACE_SECTIONS";
import { useStudio } from "@/hooks/use-studio";
import type {
  TypefaceDetailProps,
  TypefaceVersion,
} from "@/types/components";
import type { TypefaceLayoutItem } from "@/types/layout-typeface";
import type {
  Font,
  Package,
  StudioTypeface,
} from "@/types/studio";
import { slugify } from "@/utils/slugify";
import ChangesSavedPill from "../changes-saved-pill";
import {
  AssetsSection,
  BasicInformationSection,
  EulaSection,
  FontsListSection,
  PackagesListSection,
  ShopSection,
  SpecimenSection,
  TypefaceDetailHeader,
  TypefacePageSection,
  VersionsListSection,
} from "./detail";

const SECTION_OFFSET = 120;

export default function TypefaceDetail({
  typefaceSlug,
}: TypefaceDetailProps) {
  const { studio, isLoading, updateTypeface } = useStudio();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollUpdateScheduled = useRef(false);
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
        releaseDate: typeface.releaseDate,
        description: typeface.description,
        supportedLanguages:
          typeface.supportedLanguages || [],
        designerIds: typeface.designerIds || [],
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

  // Update active section in URL when scrolling (scroll-spy)
  const updateActiveSection = useCallback(() => {
    if (!typeface) return;
    if (scrollUpdateScheduled.current) return;
    scrollUpdateScheduled.current = true;

    requestAnimationFrame(() => {
      scrollUpdateScheduled.current = false;
      let activeId: string | null = null;
      for (const section of TYPEFACE_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= SECTION_OFFSET) {
            activeId = section.id;
          }
        }
      }
      if (!activeId && TYPEFACE_SECTIONS.length > 0) {
        activeId = TYPEFACE_SECTIONS[0].id;
      }
      if (
        activeId &&
        activeId !== searchParams.get("section")
      ) {
        const params = new URLSearchParams(
          searchParams.toString()
        );
        params.set("section", activeId);
        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      }
    });
  }, [typeface, pathname, router, searchParams]);

  useLenis(() => {
    if (typeface) updateActiveSection();
  }, [typeface, updateActiveSection]);

  useEffect(() => {
    if (typeface) updateActiveSection();
  }, [typeface, updateActiveSection]);

  const saveToFirebase = useCallback(
    async (dataToSave: Partial<StudioTypeface>) => {
      if (!typeface) return;
      setIsSaving(true);
      try {
        await updateTypeface(typeface.id, {
          ...dataToSave,
          characters:
            parseInt(
              dataToSave.characters?.toString() || "0",
              10
            ) || 0,
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

  const handleTypefaceCardDisplayFontChange = useCallback(
    (fontId: string) => {
      setFormData((prev) => ({
        ...prev,
        typefaceCardDisplayFontId: fontId,
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

      <div
        id="information"
        className="scroll-mt-8"
      >
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
          onTypefaceVisionChange={
            handleTypefaceVisionChange
          }
          onDesignerIdsChange={handleDesignerIdsChange}
          fonts={formData.fonts || []}
          displayFontId={formData.displayFontId || ""}
          fontLineText={formData.fontLineText || ""}
          onDisplayFontChange={handleDisplayFontChange}
          typefaceCardDisplayFontId={
            formData.typefaceCardDisplayFontId || ""
          }
          typefaceCardContent={
            formData.typefaceCardContent || ""
          }
          onTypefaceCardDisplayFontChange={
            handleTypefaceCardDisplayFontChange
          }
        />
      </div>

      <div
        id="typeface-page"
        className="scroll-mt-8"
      >
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
          typefaceFonts={(formData.fonts || []).map(
            (f) => ({
              id: f.id,
              styleName: f.styleName,
              weight: f.weight,
            })
          )}
        />
      </div>

      <div
        id="versions"
        className="scroll-mt-8"
      >
        <VersionsListSection
          versions={versions}
          onAddVersionClick={() =>
            setIsVersionModalOpen(true)
          }
          onEditVersion={handleEditVersion}
          onRemoveVersion={handleRemoveVersion}
        />
      </div>

      <div
        id="shop"
        className="scroll-mt-8"
      >
        <ShopSection
          printPrice={String(formData.printPrice ?? 0)}
          webPrice={String(formData.webPrice ?? 0)}
          appPrice={String(formData.appPrice ?? 0)}
          onInputChange={handleInputChange}
        />
      </div>

      <div
        id="fonts"
        className="scroll-mt-8"
      >
        <FontsListSection
          fonts={formData.fonts || []}
          onRemoveFont={handleRemoveFont}
          onEditFont={handleEditFont}
          onAddFontClick={() => setIsFontModalOpen(true)}
        />
      </div>

      <div
        id="packages"
        className="scroll-mt-8"
      >
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
      </div>

      <div
        id="eula"
        className="scroll-mt-8"
      >
        <EulaSection
          studioId={studio?.id || ""}
          eula={formData.eula || ""}
          onEulaChange={handleFileChange("eula")}
          onOpenEulaGenerator={() =>
            setIsEulaModalOpen(true)
          }
        />
      </div>

      <div
        id="specimen"
        className="scroll-mt-8"
      >
        <SpecimenSection
          studioId={studio?.id || ""}
          typefaceSlug={typefaceSlug}
          specimen={formData.specimen || ""}
          onSpecimenChange={handleFileChange("specimen")}
        />
      </div>

      <div
        id="assets"
        className="scroll-mt-8"
      >
        <AssetsSection
          studioId={studio?.id || ""}
          heroLetter={formData.heroLetter || ""}
          variableFontFile={formData.variableFontFile || ""}
          galleryImages={formData.galleryImages || []}
          onHeroLetterChange={handleFileChange(
            "heroLetter"
          )}
          onVariableFontFileChange={handleFileChange(
            "variableFontFile"
          )}
          onGalleryImagesChange={handleGalleryImagesChange}
        />
      </div>

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
