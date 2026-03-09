"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/class-names";

const AccountNavigation = dynamic(
  () => import("../navigation/account-navigation"),
  {
    ssr: false,
    loading: () => (
      <div className="relative z-0 w-full">
        <div className="mb-2 h-7 w-48 animate-pulse rounded bg-neutral-200" />
        <div className="mt-2 flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 w-full animate-pulse rounded-lg bg-neutral-100"
            />
          ))}
        </div>
      </div>
    ),
  }
);

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
          ? "pt-24 pr-0 pb-[30px] pl-10"
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
