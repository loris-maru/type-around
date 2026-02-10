import AccountNavigation from "@/components/layout/navigation/account-navigation";
import { StudioProvider } from "@/hooks/studio-context";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudioProvider>
      <div className="relative w-full px-10 py-44">
        <div
          className="fixed inset-0 -z-10 h-screen w-screen"
          style={{
            background:
              "linear-gradient(180deg, #FFF8E8 29.33%, #F2F2F2 100%)",
          }}
        />
        <div className="fixed z-50 w-68">
          <AccountNavigation />
        </div>
        <div className="relative pl-[320px]">
          {children}
        </div>
      </div>
    </StudioProvider>
  );
}
