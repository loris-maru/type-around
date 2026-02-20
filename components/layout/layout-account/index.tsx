import AccountLayoutContent from "@/components/layout/account-layout-content";
import { StudioProvider } from "@/hooks/studio-context";

export default function LayoutAccount({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudioProvider>
      <AccountLayoutContent>
        {children}
      </AccountLayoutContent>
    </StudioProvider>
  );
}
