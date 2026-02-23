"use client";

import {
  useCallback,
  useState,
  useSyncExternalStore,
} from "react";
import { FontsInUseCard } from "@/components/molecules/cards";
import Pagination from "@/components/molecules/pagination";
import {
  FONTS_IN_USE_MOBILE_INITIAL,
  FONTS_IN_USE_MOBILE_LOAD_MORE,
  FONTS_IN_USE_PER_PAGE,
} from "@/constant/UI_LAYOUT";
import { useStudioFonts } from "@/contexts/studio-fonts-context";
import { FONTS_IN_USE } from "@/mock-data/fonts-in-use";

export default function FontsInUseList() {
  const { displayFontFamily, textFontFamily } =
    useStudioFonts();
  const [page, setPage] = useState(0);
  const [mobileVisibleCount, setMobileVisibleCount] =
    useState(FONTS_IN_USE_MOBILE_INITIAL);

  const isMobile = useSyncExternalStore(
    useCallback((cb: () => void) => {
      const mq = window.matchMedia("(max-width: 1023px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    }, []),
    useCallback(
      () =>
        typeof window !== "undefined"
          ? window.matchMedia("(max-width: 1023px)").matches
          : false,
      []
    ),
    useCallback(() => false, [])
  );

  const totalItems = FONTS_IN_USE.length;
  const totalPages = Math.ceil(
    totalItems / FONTS_IN_USE_PER_PAGE
  );

  const startIndex = page * FONTS_IN_USE_PER_PAGE;
  const endIndex = Math.min(
    startIndex + FONTS_IN_USE_PER_PAGE,
    totalItems
  );

  const visibleItems = isMobile
    ? FONTS_IN_USE.slice(0, mobileVisibleCount)
    : FONTS_IN_USE.slice(startIndex, endIndex);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;
  const canLoadMore = mobileVisibleCount < totalItems;

  const goToPrev = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const goToNext = useCallback(() => {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  }, [totalPages]);

  const loadMore = useCallback(() => {
    setMobileVisibleCount((prev) =>
      Math.min(
        prev + FONTS_IN_USE_MOBILE_LOAD_MORE,
        FONTS_IN_USE.length
      )
    );
  }, []);

  return (
    <div className="relative flex w-full flex-col gap-y-8 px-5 py-24 lg:px-10">
      <div className="relative flex w-full flex-col items-center gap-x-12 lg:flex-row">
        <header className="relative mb-8 flex w-full flex-col lg:-top-[40px] lg:mb-0 lg:w-1/3">
          <h3
            className="font-black text-4xl text-black lg:text-6xl"
            style={{ fontFamily: displayFontFamily }}
          >
            Fonts in use
          </h3>
          <div
            className="text-black text-lg lg:mt-2 lg:text-sm"
            style={{ fontFamily: textFontFamily }}
          >
            Total of {totalItems} fonts in use
          </div>
        </header>

        {/* 3 cols × 2 rows grid */}
        <div className="relative w-full lg:w-2/3">
          <div className="relative mb-10 grid w-full grid-cols-1 gap-8 lg:grid-cols-3 lg:grid-rows-2">
            {visibleItems.map((font) => (
              <FontsInUseCard
                key={font.id}
                name={font.name}
                typeface={font.typeface}
                category={font.category}
                image={font.image}
              />
            ))}
          </div>
          {/* Mobile: Load more button */}
          {isMobile && canLoadMore && (
            <div className="flex justify-center pt-4 lg:hidden">
              <button
                type="button"
                onClick={loadMore}
                aria-label="Load more fonts in use"
                className="rounded-md border border-neutral-300 bg-white px-6 py-3 font-whisper text-black text-sm transition-colors hover:bg-neutral-50"
              >
                Load more
              </button>
            </div>
          )}
          {/* Desktop: Pagination */}
          {!isMobile && totalPages > 1 && (
            <Pagination
              goToPrev={goToPrev}
              goToNext={goToNext}
              canPrev={canPrev}
              canNext={canNext}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
            />
          )}
        </div>
      </div>
    </div>
  );
}
