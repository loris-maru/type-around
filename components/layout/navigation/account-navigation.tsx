"use client";

import { useCallback, useEffect } from "react";
import {
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import {
  RiArrowDownSLine,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { cn } from "@/utils/class-names";
import { slugify } from "@/utils/slugify";
import { useStudio } from "@/hooks/use-studio";
import {
  ACCOUNT_NAV_ITEMS,
  DEFAULT_ACCOUNT_NAV,
} from "@/constant/ACCOUNT_NAV_ITEMS";
import { TYPEFACE_SECTIONS } from "@/constant/TYPEFACE_SECTIONS";

const NavigationButton = ({
  label,
  activeNav,
  onNavChange,
  hasSubmenu,
  isExpanded,
  count,
}: {
  label: string;
  activeNav: string;
  onNavChange: (slug: string) => void;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  count?: number;
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
        "relative w-full text-base font-whisper rounded-lg border text-left px-4 py-2 cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-between",
        isActive
          ? "text-black border-black shadow-button font-semibold"
          : "text-dark-gray border-medium-gray shadow-medium-gray font-medium"
      )}
      onClick={handleClick}
    >
      <div>{label}</div>
      <div className="flex items-center gap-2">
        {count !== undefined && (
          <span className="text-sm text-neutral-500">
            {count}
          </span>
        )}
        {hasSubmenu && (
          <RiArrowDownSLine
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        )}
      </div>
    </button>
  );
};

const TypefaceSubItem = ({
  name,
  isActive,
  onClick,
}: {
  name: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left text-base font-whisper px-4 py-3 transition-colors",
        isActive
          ? "text-black font-semibold"
          : "text-dark-gray font-normal"
      )}
    >
      {name}
    </button>
  );
};

const SectionLink = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left text-sm font-whisper px-6 py-2 text-neutral-500 hover:text-black transition-colors"
    >
      {label}
    </button>
  );
};

export default function AccountNavigation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { studio } = useStudio();

  const activeNav =
    searchParams.get("nav") || DEFAULT_ACCOUNT_NAV;
  const activeTypeface = searchParams.get("typeface");
  const isTypefacesExpanded = activeNav === "typefaces";

  useEffect(() => {
    if (!searchParams.get("nav")) {
      const params = new URLSearchParams(
        searchParams.toString()
      );
      params.set("nav", DEFAULT_ACCOUNT_NAV);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, router, pathname]);

  const handleNavChange = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(
        searchParams.toString()
      );
      params.set("nav", slug);
      // Remove typeface param when changing main nav
      params.delete("typeface");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const handleTypefaceClick = useCallback(
    (typefaceSlug: string) => {
      const params = new URLSearchParams(
        searchParams.toString()
      );
      params.set("nav", "typefaces");
      params.set("typeface", typefaceSlug);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const handleSectionClick = useCallback(
    (sectionId: string) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },
    []
  );

  return (
    <div className="relative z-0 w-full">
      <div className="mb-2">Your studio</div>
      <div className="relative w-full flex flex-col gap-y-2">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const isTypefaces = item === "Typefaces";
          const hasTypefaces =
            isTypefaces &&
            studio?.typefaces &&
            studio.typefaces.length > 0;
          const typefaceCount = isTypefaces
            ? studio?.typefaces?.length
            : undefined;

          return (
            <div key={item}>
              <NavigationButton
                label={item}
                activeNav={activeNav}
                onNavChange={handleNavChange}
                hasSubmenu={hasTypefaces}
                isExpanded={
                  hasTypefaces && isTypefacesExpanded
                }
                count={typefaceCount}
              />

              {/* Typefaces submenu */}
              {hasTypefaces && isTypefacesExpanded && (
                <div className="mt-1 flex flex-col gap-y-1">
                  {studio.typefaces.map((typeface) => {
                    const isActiveTypeface =
                      activeTypeface === typeface.slug;
                    return (
                      <div key={typeface.id}>
                        <TypefaceSubItem
                          name={typeface.name}
                          isActive={isActiveTypeface}
                          onClick={() =>
                            handleTypefaceClick(
                              typeface.slug
                            )
                          }
                        />
                        {/* Section links for active typeface */}
                        {isActiveTypeface && (
                          <div className="flex flex-col">
                            {TYPEFACE_SECTIONS.map(
                              (section) => (
                                <SectionLink
                                  key={section.id}
                                  label={section.label}
                                  onClick={() =>
                                    handleSectionClick(
                                      section.id
                                    )
                                  }
                                />
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
