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
    <nav
      aria-label="My account"
      className="relative z-0 w-full"
    >
      <div className="swiss-rule pt-3">
        <div className="swiss-label flex items-center gap-2 text-neutral-500">
          <span className="inline-block h-2 w-2 bg-swiss-red" />
          Account
        </div>
        <div className="swiss-h2 mt-3">My account</div>
      </div>

      <div className="swiss-rule relative mt-8 flex w-full flex-col divide-y divide-neutral-200">
        {MY_ACCOUNT_NAV_ITEMS.map((item, itemIndex) => {
          const slug = slugify(item);
          const isActive = activeNav === slug;

          return (
            <button
              key={item}
              type="button"
              aria-label={item}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex w-full cursor-pointer items-center gap-4 py-3 text-left font-sotto text-[15px] leading-none transition-colors",
                isActive
                  ? "font-semibold text-black"
                  : "font-normal text-neutral-500 hover:text-black"
              )}
              onClick={() => handleNavChange(slug)}
            >
              <span
                className={cn(
                  "swiss-num w-6 shrink-0 text-xs",
                  isActive
                    ? "text-swiss-red"
                    : "text-neutral-400 group-hover:text-black"
                )}
              >
                {String(itemIndex + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{item}</span>
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="swiss-rule mt-8 pt-3">
        <SignOutButton redirectUrl="/">
          <button
            type="button"
            className="swiss-label flex w-full cursor-pointer items-center gap-2 py-1 text-neutral-500 transition-colors hover:text-swiss-red"
          >
            <RiLogoutBoxLine className="h-3.5 w-3.5" />
            Log out
          </button>
        </SignOutButton>
      </div>
    </nav>
  );
}
