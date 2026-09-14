import MyAccountNavigation from "@/components/segments/my-account/navigation";

export default function LayoutMyAccount({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="account-swiss relative w-full px-10 pt-24 pb-24">
      <div className="fixed inset-0 -z-10 h-screen w-screen bg-white" />
      <aside className="fixed top-24 z-50 w-64">
        <MyAccountNavigation />
      </aside>
      <div className="relative pl-[320px]">{children}</div>
    </div>
  );
}
