import LayoutStudio from "@/components/layout/layout-studio";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutStudio>{children}</LayoutStudio>;
}
