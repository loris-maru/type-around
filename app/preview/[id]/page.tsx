import { StudioProvider } from "@/hooks/studio-context";
import StudioPreview from "@/components/segments/account/preview";

export default function StudioPreviewPage() {
  return (
    <StudioProvider>
      <StudioPreview />
    </StudioProvider>
  );
}
