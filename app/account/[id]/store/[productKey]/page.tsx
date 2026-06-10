import { ErrorBoundary } from "@/components/global/error-boundary";
import ProductEditorPage from "@/components/segments/account/store/product-editor-page";

type StoreProductPageProps = {
  params: Promise<{ id: string; productKey: string }>;
};

export default async function StoreProductPage({
  params,
}: StoreProductPageProps) {
  const { id, productKey } = await params;

  return (
    <ErrorBoundary>
      <ProductEditorPage
        productKey={productKey}
        studioId={id}
      />
    </ErrorBoundary>
  );
}
