import LayoutAccount from "@/components/layout/layout-account";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutAccount>{children}</LayoutAccount>;
}
