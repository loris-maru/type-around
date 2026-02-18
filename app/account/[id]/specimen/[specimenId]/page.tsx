import TypefaceSpecimenPage from "@/components/segments/account/typefaces/typeface-specimen-page";

type SpecimenPageProps = {
  params: Promise<{ id: string; specimenId: string }>;
};

export default async function SpecimenPage({
  params,
}: SpecimenPageProps) {
  const { specimenId } = await params;

  return <TypefaceSpecimenPage specimenId={specimenId} />;
}
