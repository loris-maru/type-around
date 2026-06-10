"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useStudio } from "@/hooks/use-studio";
import type {
  StoreProduct,
  StoreProductVariant,
} from "@/types/studio";
import { generateUUID } from "@/utils/generate-uuid";

type UseProductEditorProps = {
  productKey: string;
};

function createDefaultVariant(): StoreProductVariant {
  return {
    key: generateUUID(),
    title: "Default",
    price: 0,
  };
}

export function useProductEditor({
  productKey,
}: UseProductEditorProps) {
  const { studio, isLoading, updateProducts } = useStudio();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const isNew = productKey === "new";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const existingProduct = useMemo(
    () =>
      isNew
        ? null
        : ((studio?.products ?? []).find(
            (p) => p.key === productKey
          ) ?? null),
    [isNew, productKey, studio?.products]
  );

  const [name, setName] = useState(
    existingProduct?.name ?? ""
  );
  const [description, setDescription] = useState(
    existingProduct?.description ?? ""
  );
  const [category, setCategory] = useState(
    existingProduct?.category ?? ""
  );
  const [variants, setVariants] = useState<
    StoreProductVariant[]
  >(
    existingProduct?.variants &&
      existingProduct.variants.length > 0
      ? existingProduct.variants
      : [createDefaultVariant()]
  );
  const [images, setImages] = useState<string[]>(
    existingProduct?.images ?? []
  );
  const [coverImageIndex, setCoverImageIndex] = useState(
    existingProduct?.coverImageIndex ?? 0
  );
  const [available, setAvailable] = useState(
    existingProduct?.available ?? true
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(
    null
  );

  // Sync local state when the existing product loads
  useEffect(() => {
    if (!existingProduct) return;
    setName(existingProduct.name);
    setDescription(existingProduct.description);
    setCategory(existingProduct.category ?? "");
    setVariants(
      existingProduct.variants &&
        existingProduct.variants.length > 0
        ? existingProduct.variants
        : [createDefaultVariant()]
    );
    setImages(existingProduct.images ?? []);
    setCoverImageIndex(
      existingProduct.coverImageIndex ?? 0
    );
    setAvailable(existingProduct.available ?? true);
  }, [existingProduct]);

  // Keep coverImageIndex in range if images are removed
  useEffect(() => {
    if (images.length === 0) {
      if (coverImageIndex !== 0) setCoverImageIndex(0);
      return;
    }
    if (coverImageIndex >= images.length) {
      setCoverImageIndex(images.length - 1);
    }
  }, [images, coverImageIndex]);

  const buildProduct = useCallback((): StoreProduct => {
    return {
      key: isNew
        ? generateUUID()
        : (existingProduct?.key ?? productKey),
      name,
      description,
      category,
      images,
      coverImageIndex: Math.max(
        0,
        Math.min(
          coverImageIndex,
          Math.max(0, images.length - 1)
        )
      ),
      available,
      variants,
    };
  }, [
    available,
    category,
    coverImageIndex,
    description,
    existingProduct?.key,
    images,
    isNew,
    name,
    productKey,
    variants,
  ]);

  const handleSave = useCallback(async () => {
    if (!studio) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      const product = buildProduct();
      const currentProducts = studio.products ?? [];
      const updatedProducts = isNew
        ? [...currentProducts, product]
        : currentProducts.map((item) =>
            item.key === product.key ? product : item
          );

      await updateProducts(updatedProducts);
      router.push(`/account/${studio.id}?nav=store`);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to save product"
      );
    } finally {
      setIsSaving(false);
    }
  }, [buildProduct, isNew, router, studio, updateProducts]);

  return {
    // metadata
    name,
    setName,
    description,
    setDescription,
    category,
    setCategory,
    // variants
    variants,
    setVariants,
    // images
    images,
    setImages,
    coverImageIndex,
    setCoverImageIndex,
    // availability
    available,
    setAvailable,
    // save flow
    isSaving,
    saveError,
    handleSave,
    // status
    isNew,
    isMounted,
    isLoading,
    existingProduct,
    studioPageId: studio?.id,
    studioId: studio?.id ?? "",
  };
}
