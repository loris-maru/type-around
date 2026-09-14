import ReactDOM from "react-dom";
import AccountLayoutContent from "@/components/layout/account-layout-content";
import { StudioProvider } from "@/hooks/studio-context";

export default function LayoutAccount({
  children,
}: {
  children: React.ReactNode;
}) {
  // The account dashboard is set in Sotto (text) and Godo Rounded (display).
  // Preload both so the Swiss layout does not reflow on font swap.
  ReactDOM.preload("/fonts/Sotto_VAR.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  ReactDOM.preload("/fonts/GodoRounded1-Black.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });

  return (
    <StudioProvider>
      <AccountLayoutContent>
        {children}
      </AccountLayoutContent>
    </StudioProvider>
  );
}
