import StudioInternalNavigation from "@/components/molecules/studios/internal-navigation";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full">
      <StudioInternalNavigation />
      {children}
    </div>
  );
}
