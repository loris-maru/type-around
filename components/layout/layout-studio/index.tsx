"use client";

import { usePathname } from "next/navigation";
import StudioInternalNavigation from "@/components/molecules/studios/internal-navigation";

export default function LayoutStudio({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isTypefacePage = pathname?.includes("/typeface/");

  return (
    <div className="relative w-full">
      {!isTypefacePage && <StudioInternalNavigation />}
      {children}
    </div>
  );
}
