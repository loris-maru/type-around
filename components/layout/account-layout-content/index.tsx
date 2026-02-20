"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/utils/class-names";
import AccountNavigation from "../navigation/account-navigation";

export default function AccountLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSpecimenPage = pathname?.includes("/specimen/");

  return (
    <div
      className={cn(
        "relative w-full",
        isSpecimenPage
          ? "pl-10 pr-0 pt-24 pb-[30px]"
          : "px-10 py-44"
      )}
    >
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
        className={cn(
          "relative",
          !isSpecimenPage && "pl-[320px]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
