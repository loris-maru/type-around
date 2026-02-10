"use client";

import { useCallback, useState } from "react";
import FontsInUseCard from "@/components/molecules/cards/fonts-in-use";
import Pagination from "@/components/molecules/pagination";
import { FONTS_IN_USE } from "@/mock-data/fonts-in-use";

const PER_PAGE = 6;

export default function FontsInUseList() {
  const [page, setPage] = useState(0);

  const totalItems = FONTS_IN_USE.length;
  const totalPages = Math.ceil(totalItems / PER_PAGE);

  const startIndex = page * PER_PAGE;
  const endIndex = Math.min(
    startIndex + PER_PAGE,
    totalItems
  );
  const visibleItems = FONTS_IN_USE.slice(
    startIndex,
    endIndex
  );

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const goToPrev = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const goToNext = useCallback(() => {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  }, [totalPages]);

  return (
    <div className="relative flex w-full flex-col gap-y-8 px-10 py-24">
      <div className="relative flex w-full flex-row items-center gap-x-12">
        <header className="relative -top-[40px] flex w-1/3 flex-col">
          <h3 className="font-black font-ortank text-6xl text-black">
            Fonts in use
          </h3>
          <div className="mt-2 font-whisper text-black text-sm">
            Total of {totalItems} fonts in use
          </div>
        </header>

        {/* 3 cols × 2 rows grid */}
        <div className="relative w-2/3">
          <div className="relative mb-10 grid w-full grid-cols-3 grid-rows-2 gap-8">
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
          {/* Pagination */}
          {totalPages > 1 && (
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
