import LayoutMyAccount from "@/components/layout/layout-my-account";

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutMyAccount>{children}</LayoutMyAccount>;
}
