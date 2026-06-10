"use client";

import Link from "next/link";
import { ProductEditorActions } from "@/components/segments/account/store/editor/product-editor-actions";
import { ProductEditorBody } from "@/components/segments/account/store/editor/product-editor-body";
import { ProductEditorHeader } from "@/components/segments/account/store/editor/product-editor-header";
import { useProductEditor } from "@/components/segments/account/store/editor/use-product-editor";

type ProductEditorPageProps = {
  productKey: string;
  studioId: string;
};

export default function ProductEditorPage({
  productKey,
  studioId,
}: ProductEditorPageProps) {
  const {
    name,
    setName,
    description,
    setDescription,
    category,
    setCategory,
    variants,
    setVariants,
    images,
    setImages,
    coverImageIndex,
    setCoverImageIndex,
    available,
    setAvailable,
    isSaving,
    saveError,
    isNew,
    isMounted,
    isLoading,
    existingProduct,
    studioPageId,
    handleSave,
  } = useProductEditor({ productKey });

  if (!isMounted || isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
      </div>
    );
  }

  if (!isNew && studioPageId && !existingProduct) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="font-whisper text-neutral-500">
          Product not found.
        </p>
        <Link
          href={`/account/${studioPageId}?nav=store`}
          className="font-medium font-whisper text-black underline"
        >
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col gap-8 pb-28">
      <ProductEditorHeader
        studioId={studioId}
        isNew={isNew}
      />

      <ProductEditorBody
        studioId={studioId}
        name={name}
        onNameChange={setName}
        description={description}
        onDescriptionChange={setDescription}
        category={category}
        onCategoryChange={setCategory}
        variants={variants}
        onVariantsChange={setVariants}
        images={images}
        onImagesChange={setImages}
        coverImageIndex={coverImageIndex}
        onCoverImageIndexChange={setCoverImageIndex}
        available={available}
        onAvailableChange={setAvailable}
      />

      <ProductEditorActions
        onSave={handleSave}
        isSaving={isSaving}
        saveError={saveError}
      />
    </div>
  );
}
