"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import {
  RiArrowDownSLine,
  RiLogoutBoxLine,
} from "react-icons/ri";
import {
  ACCOUNT_NAV_ITEMS,
  DEFAULT_ACCOUNT_NAV,
} from "@/constant/ACCOUNT_NAV_ITEMS";
import { REVIEWER_SECTIONS } from "@/constant/REVIEWER_SECTIONS";
import { TYPEFACE_SECTIONS } from "@/constant/TYPEFACE_SECTIONS";
import { useStudio } from "@/hooks/use-studio";
import { cn } from "@/utils/class-names";
import { slugify } from "@/utils/slugify";

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
        "relative flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-2 text-left font-whisper text-base transition-all duration-300 ease-in-out",
        isActive
          ? "border-black font-semibold text-black shadow-button"
          : "border-medium-gray font-medium text-dark-gray shadow-medium-gray"
      )}
      onClick={handleClick}
    >
      <div>{label}</div>
      <div className="flex items-center gap-2">
        {count !== undefined && (
          <span className="text-neutral-500 text-sm">
            {count}
          </span>
        )}
        {hasSubmenu && (
          <RiArrowDownSLine
            className={cn(
              "h-4 w-4 transition-transform duration-200",
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
        "w-full px-4 text-left font-whisper text-base transition-colors",
        isActive
          ? "font-semibold text-black"
          : "font-normal text-dark-gray"
      )}
    >
      {name}
    </button>
  );
};

const SectionLink = ({
  label,
  onClick,
  isActive,
}: {
  label: string;
  onClick: () => void;
  isActive: boolean;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full px-6 py-2 text-left font-whisper text-sm transition-colors",
        isActive
          ? "font-bold text-black"
          : "text-neutral-500 hover:text-black"
      )}
    >
      {label}
    </button>
  );
};

export default function AccountNavigation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { studio } = useStudio();

  const activeNav =
    searchParams.get("nav") || DEFAULT_ACCOUNT_NAV;
  const activeTypeface = searchParams.get("typeface");
  const activeTypefaceSection =
    searchParams.get("section") || TYPEFACE_SECTIONS[0]?.id;
  const activeReviewerSection =
    searchParams.get("reviewer");
  const isTypefacesExpanded = activeNav === "typefaces";
  const isReviewerExpanded = activeNav === "reviewer";

  const isReviewer = useMemo(() => {
    if (!user?.id || !studio?.members) return false;
    const member = studio.members.find(
      (m) => m.id === user.id
    );
    return member?.isReviewer === true;
  }, [user?.id, studio?.members]);

  const navItems = useMemo(() => {
    if (!isReviewer) return ACCOUNT_NAV_ITEMS;
    const idx = ACCOUNT_NAV_ITEMS.indexOf("Feedback");
    const before = ACCOUNT_NAV_ITEMS.slice(0, idx + 1);
    const after = ACCOUNT_NAV_ITEMS.slice(idx + 1);
    return [...before, "Reviewer", ...after];
  }, [isReviewer]);

  useEffect(() => {
    const nav = searchParams.get("nav");
    // Redirect legacy nav values to members (settings/designers were replaced)
    if (nav === "settings" || nav === "designers") {
      const params = new URLSearchParams(
        searchParams.toString()
      );
      params.set("nav", "members");
      router.replace(`${pathname}?${params.toString()}`);
      return;
    }
    if (!nav) {
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
      params.delete("typeface");
      if (slug === "reviewer" && !params.get("reviewer")) {
        params.set("reviewer", "calendar");
      } else if (slug !== "reviewer") {
        params.delete("reviewer");
      }
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
      const params = new URLSearchParams(
        searchParams.toString()
      );
      params.set("section", sectionId);
      router.push(`${pathname}?${params.toString()}`);

      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },
    [searchParams, router, pathname]
  );

  const handleReviewerNavChange = useCallback(
    (sectionId: string) => {
      const params = new URLSearchParams(
        searchParams.toString()
      );
      params.set("nav", "reviewer");
      params.set("reviewer", sectionId);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return (
    <div className="relative z-0 w-full">
      <div className="mb-2 font-bold font-ortank text-xl">
        {studio?.name || "Your studio"}
      </div>
      <div className="relative flex w-full flex-col gap-y-2">
        {navItems.map((item) => {
          const isTypefaces = item === "Typefaces";
          const isReviewerItem = item === "Reviewer";
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
                hasSubmenu={hasTypefaces || isReviewerItem}
                isExpanded={
                  (hasTypefaces && isTypefacesExpanded) ||
                  (isReviewerItem && isReviewerExpanded)
                }
                count={typefaceCount}
              />

              {/* Typefaces submenu */}
              {hasTypefaces && isTypefacesExpanded && (
                <div className="mt-1 flex flex-col gap-y-3 py-4">
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
                          <div className="my-4 ml-4 flex flex-col border-neutral-300 border-l">
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
                                  isActive={
                                    activeTypefaceSection ===
                                    section.id
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

              {/* Reviewer submenu */}
              {isReviewerItem && isReviewerExpanded && (
                <div className="my-4 ml-4 flex flex-col border-neutral-300 border-l">
                  {REVIEWER_SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() =>
                        handleReviewerNavChange(section.id)
                      }
                      className={cn(
                        "w-full px-6 py-2 text-left font-whisper text-sm transition-colors",
                        activeReviewerSection === section.id
                          ? "font-semibold text-black"
                          : "text-neutral-500 hover:text-black"
                      )}
                    >
                      {section.label}
                    </button>
                  ))}
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
            className="flex w-full cursor-pointer items-center gap-2 font-whisper text-base text-black transition-colors"
          >
            <RiLogoutBoxLine className="h-4 w-4" />
            Log-out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
