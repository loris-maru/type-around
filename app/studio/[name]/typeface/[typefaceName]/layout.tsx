import TypefaceInternalNavigation from "@/components/segments/typeface/internal-navigation";

export default function TypefaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <TypefaceInternalNavigation />
    </>
  );
}
