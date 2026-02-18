"use client";

import { usePathname } from "next/navigation";
import AccountNavigation from "./navigation/account-navigation";

export default function AccountLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSpecimenPage = pathname?.includes("/specimen/");

  return (
    <div className="relative w-full px-10 py-44">
      <div
        className="fixed inset-0 -z-10 h-screen w-screen"
        style={{
          background:
            "linear-gradient(180deg, #FFF8E8 29.33%, #F2F2F2 100%)",
        }}
      />
      {!isSpecimenPage && (
        <div className="fixed z-50 w-68">
          <AccountNavigation />
        </div>
      )}
      <div
        className={
          isSpecimenPage
            ? "relative"
            : "relative pl-[320px]"
        }
      >
        {children}
      </div>
    </div>
  );
}
