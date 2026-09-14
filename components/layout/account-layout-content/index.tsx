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
        <div className="swiss-rule pt-3">
          <div className="h-3 w-16 animate-pulse bg-neutral-200" />
          <div className="mt-3 h-8 w-40 animate-pulse bg-neutral-200" />
        </div>
        <div className="mt-8 flex flex-col">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="swiss-rule-light flex items-center gap-4 py-3"
            >
              <div className="h-3 w-5 animate-pulse bg-neutral-200" />
              <div className="h-3 w-24 animate-pulse bg-neutral-200" />
            </div>
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
  const isBlogEditorPage =
    pathname?.includes("/blog/") &&
    !pathname?.endsWith("/blog/preview");
  const isStoreEditorPage = pathname?.includes("/store/");
  const isFullWidthEditorPage =
    isSpecimenPage ||
    isBlogEditorPage ||
    isStoreEditorPage ||
    pathname?.endsWith("/blog/preview");

  return (
    <div
      className={cn(
        "account-swiss relative w-full",
        isFullWidthEditorPage
          ? "pt-24 pr-0 pb-[30px] pl-10"
          : "px-10 pt-24 pb-24"
      )}
    >
      {/* Flat white ground: the Swiss page is the sheet, not a gradient */}
      <div className="fixed inset-0 -z-10 h-screen w-screen bg-white" />

      {!isFullWidthEditorPage && (
        <aside className="fixed top-24 z-50 w-64">
          <AccountNavigation />
        </aside>
      )}

      <div
        className={cn(
          "relative",
          !isFullWidthEditorPage && "pl-[320px]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
