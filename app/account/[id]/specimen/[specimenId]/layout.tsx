import BackToTypefaceLink from "@/components/segments/account/specimen/back-to-typeface-link";
import CenterOnPageButton from "@/components/segments/account/specimen/center-on-page-button";
import PageSettingPanel from "@/components/segments/account/specimen/panels/page-setting-panel";
import SpecimenPanel from "@/components/segments/account/specimen/panels/specimen-panel";
import { SpecimenPageProvider } from "@/contexts/specimen-page-context";
import type { SpecimenLayoutProps } from "@/types/specimen";

export default async function SpecimenLayout({
  children,
  params,
}: SpecimenLayoutProps) {
  const { id: studioId, specimenId } = await params;
  const typefaceSlug = specimenId.slice(0, -37);

  return (
    <SpecimenPageProvider>
      <div className="relative flex h-[calc(100vh-136px)] flex-col gap-6">
        <div className="relative z-30 flex shrink-0 items-center gap-2">
          {studioId && (
            <BackToTypefaceLink
              studioId={studioId}
              typefaceSlug={typefaceSlug}
            />
          )}
          <div className="flex-1" />
          <CenterOnPageButton specimenId={specimenId} />
        </div>
        <div className="relative z-10 flex min-h-0 flex-1 items-stretch gap-6 overflow-hidden">
          <SpecimenPanel
            specimenId={specimenId}
            typefaceSlug={typefaceSlug}
          />
          <div className="relative min-w-0 flex-1">
            {children}
          </div>
          <PageSettingPanel
            specimenId={specimenId}
            studioId={studioId}
          />
        </div>
      </div>
    </SpecimenPageProvider>
  );
}
