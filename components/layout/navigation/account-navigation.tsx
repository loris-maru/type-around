"use client";

import { useCallback, useEffect } from "react";
import {
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";
import { cn } from "@/utils/class-names";
import { slugify } from "@/utils/slugify";

const NAV_ITEMS: string[] = [
  "About",
  "Studio page",
  "Typefaces",
  "Fonts in use",
  "Stripe",
  "Settings",
];

const DEFAULT_NAV = "about";

const NavigationButton = ({
  label,
  activeNav,
  onNavChange,
}: {
  label: string;
  activeNav: string;
  onNavChange: (slug: string) => void;
}) => {
  const slug = slugify(label);
  const isActive = activeNav === slug;

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    onNavChange(slug);
  };

  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "relative w-full text-base font-whisper rounded-lg border text-left px-4 py-2 cursor-pointer transition-all duration-300 ease-in-out",
        isActive
          ? "text-black border-black shadow-button font-semibold"
          : "text-dark-gray border-medium-gray shadow-medium-gray font-medium"
      )}
      onClick={handleClick}
    >
      <div>{label}</div>
    </button>
  );
};

export default function AccountNavigation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeNav = searchParams.get("nav") || DEFAULT_NAV;

  useEffect(() => {
    if (!searchParams.get("nav")) {
      const params = new URLSearchParams(
        searchParams.toString()
      );
      params.set("nav", DEFAULT_NAV);
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
      <div className="mb-2">Your studio</div>
      <div className="relative w-full flex flex-col gap-y-2">
        {NAV_ITEMS.map((item) => (
          <NavigationButton
            key={item}
            label={item}
            activeNav={activeNav}
            onNavChange={handleNavChange}
          />
        ))}
      </div>
    </div>
  );
}
