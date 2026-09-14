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
import {
  DEFAULT_TYPEFACE_SUBSECTION,
  TYPEFACE_SECTIONS,
} from "@/constant/TYPEFACE_SECTIONS";
import { useStudio } from "@/hooks/use-studio";
import { cn } from "@/utils/class-names";
import { slugify } from "@/utils/slugify";
import { getTypefaceSubsectionFromSearchParams } from "@/utils/typeface-subsection";

const NavigationButton = ({
  index,
  label,
  activeNav,
  onNavChange,
  hasSubmenu,
  isExpanded,
  count,
}: {
  index: number;
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
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-4 py-3 text-left font-sotto text-[15px] leading-none transition-colors",
        isActive
          ? "font-semibold text-black"
          : "font-normal text-neutral-500 hover:text-black"
      )}
      onClick={handleClick}
    >
      <span
        className={cn(
          "swiss-num w-6 shrink-0 text-xs",
          isActive
            ? "text-swiss-red"
            : "text-neutral-400 group-hover:text-black"
        )}
      >
        {String(index).padStart(2, "0")}
      </span>
      <span className="flex-1">{label}</span>
      <span className="flex items-center gap-2">
        {count !== undefined && (
          <span className="swiss-num text-neutral-400 text-xs">
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
      </span>
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
        "flex w-full items-center gap-3 py-1.5 pl-10 text-left font-sotto text-[15px] leading-none transition-colors",
        isActive
          ? "font-semibold text-black"
          : "font-normal text-neutral-500 hover:text-black"
      )}
    >
      <span
        className={cn(
          "h-px w-3 shrink-0",
          isActive ? "bg-swiss-red" : "bg-neutral-300"
        )}
      />
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
        "swiss-label w-full py-2 pl-4 text-left transition-colors",
        isActive
          ? "text-black"
          : "text-neutral-400 hover:text-black"
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
  const activeTypefaceSubsection =
    getTypefaceSubsectionFromSearchParams(searchParams);
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
    if (nav === "blog") {
      const params = new URLSearchParams(
        searchParams.toString()
      );
      params.set("nav", "articles");
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
      params.delete("subsection");
      params.delete("section");
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
      params.set("subsection", DEFAULT_TYPEFACE_SUBSECTION);
      params.delete("section");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const handleSubsectionClick = useCallback(
    (subsectionId: string) => {
      const typefaceSlug = searchParams.get("typeface");
      if (!typefaceSlug) return;

      const params = new URLSearchParams();
      params.set("nav", "typefaces");
      params.set("typeface", typefaceSlug);
      params.set("subsection", subsectionId);
      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
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
    <nav
      aria-label="Account"
      className="relative z-0 w-full"
    >
      <div className="swiss-rule pt-3">
        <div className="swiss-label flex items-center gap-2 text-neutral-500">
          <span className="inline-block h-2 w-2 bg-swiss-red" />
          Studio
        </div>
        <div className="swiss-h2 mt-3 break-words">
          {studio?.name || "Your studio"}
        </div>
        {studio?.hangeulName && (
          <div className="mt-1 font-sotto text-neutral-500 text-sm">
            {studio.hangeulName}
          </div>
        )}
      </div>

      <div className="swiss-rule relative mt-8 flex w-full flex-col divide-y divide-neutral-200">
        {navItems.map((item, itemIndex) => {
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
                index={itemIndex + 1}
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
                <div className="flex flex-col gap-y-1 pb-4">
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
                          <div className="my-3 ml-10 flex flex-col border-black border-l">
                            {TYPEFACE_SECTIONS.map(
                              (section) => (
                                <SectionLink
                                  key={section.id}
                                  label={section.label}
                                  onClick={() =>
                                    handleSubsectionClick(
                                      section.id
                                    )
                                  }
                                  isActive={
                                    activeTypefaceSubsection ===
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
                <div className="mb-4 ml-10 flex flex-col border-black border-l">
                  {REVIEWER_SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() =>
                        handleReviewerNavChange(section.id)
                      }
                      className={cn(
                        "swiss-label w-full py-2 pl-4 text-left transition-colors",
                        activeReviewerSection === section.id
                          ? "text-black"
                          : "text-neutral-400 hover:text-black"
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
