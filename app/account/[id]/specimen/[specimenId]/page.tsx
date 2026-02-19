import TypefaceSpecimenPage from "@/components/segments/account/typefaces/typeface-specimen-page";
import type { SpecimenPageProps } from "@/types/specimen";

export default async function SpecimenPage({
  params,
}: SpecimenPageProps) {
  const { specimenId } = await params;

  return <TypefaceSpecimenPage specimenId={specimenId} />;
}
