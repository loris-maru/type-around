import StudioHeader from "@/components/segments/studio/header";
import StudioProfile from "@/components/segments/studio/profile";
import TypeTester from "@/components/segments/type-tester";
import TypefacesList from "@/components/segments/studio/typefaces-list";
import FontsInUseList from "@/components/segments/studio/fonts-in-use-list";
import STUDIOS from "@/mock-data/studios";
import { slugify } from "@/utils/slugify";
import Footer from "@/components/global/footer";

export default async function StudioPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const studio = STUDIOS.find(
    (s) => slugify(s.name) === name
  );

  if (!studio) {
    return <div>Studio not found</div>;
  }

  return (
    <div className="relative w-full">
      <StudioHeader gradient={studio.gradient} />
      <StudioProfile />
      <TypeTester />
      <TypefacesList />
      <FontsInUseList />
      <Footer />
    </div>
  );
}
