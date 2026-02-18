import Link from "next/link";
import PageSettingPanel from "@/components/segments/account/specimen/panels/page-setting-panel";
import SpecimenPanel from "@/components/segments/account/specimen/panels/specimen-panel";

type SpecimenLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string; specimenId: string }>;
};

export default async function SpecimenLayout({
  children,
  params,
}: SpecimenLayoutProps) {
  const { id: studioId, specimenId } = await params;
  const typefaceSlug = specimenId.slice(0, -37);

  return (
    <div className="relative flex flex-col gap-6">
      {studioId && (
        <Link
          href={`/account/${studioId}?nav=typefaces&typeface=${typefaceSlug}`}
          className="w-fit rounded-lg border border-neutral-300 px-4 py-2 font-whisper text-sm transition-colors hover:border-black hover:bg-white"
        >
          ← Back to typeface
        </Link>
      )}
      <div className="flex w-full gap-6">
        <SpecimenPanel
          specimenId={specimenId}
          typefaceSlug={typefaceSlug}
        />
        <div className="min-w-0 flex-1">{children}</div>
        <PageSettingPanel />
      </div>
    </div>
  );
}
