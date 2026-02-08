"use client";

import { SignOutButton } from "@clerk/nextjs";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useEffect } from "react";
import { RiLogoutBoxLine } from "react-icons/ri";
import {
  DEFAULT_MY_ACCOUNT_NAV,
  MY_ACCOUNT_NAV_ITEMS,
} from "@/constant/MY_ACCOUNT_NAV_ITEMS";
import { cn } from "@/utils/class-names";
import { slugify } from "@/utils/slugify";

export default function MyAccountNavigation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeNav =
    searchParams.get("nav") || DEFAULT_MY_ACCOUNT_NAV;

  useEffect(() => {
    if (!searchParams.get("nav")) {
      const params = new URLSearchParams(
        searchParams.toString()
      );
      params.set("nav", DEFAULT_MY_ACCOUNT_NAV);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, router, pathname]);

  const handleNavChange = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(
        searchParams.toString()
      );
      params.set("nav", slug);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return (
    <div className="relative z-0 w-full">
      <div className="mb-2 font-ortank font-bold text-xl">
        My Account
      </div>
      <div className="relative w-full flex flex-col gap-y-2">
        {MY_ACCOUNT_NAV_ITEMS.map((item) => {
          const slug = slugify(item);
          const isActive = activeNav === slug;

          return (
            <button
              key={item}
              type="button"
              aria-label={item}
              className={cn(
                "relative w-full text-base font-whisper rounded-lg border text-left px-4 py-2 cursor-pointer transition-all duration-300 ease-in-out",
                isActive
                  ? "text-black border-black shadow-button font-semibold"
                  : "text-dark-gray border-medium-gray shadow-medium-gray font-medium"
              )}
              onClick={() => handleNavChange(slug)}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="mt-4">
        <SignOutButton redirectUrl="/">
          <button
            type="button"
            className="w-full flex items-center gap-2 text-base font-whisper text-black transition-colors cursor-pointer"
          >
            <RiLogoutBoxLine className="w-4 h-4" />
            Log-out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
