"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { TypefaceCard } from "@/components/molecules/cards";
import type { FontsListProps } from "@/types/fonts-list";
import type { Studio, Typeface } from "@/types/typefaces";
import { cn } from "@/utils/class-names";

export default function FontsList({
  studios: initialStudios,
}: FontsListProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const [studios, setStudios] = useState<Studio[]>(
    initialStudios ?? []
  );
  const [typefaces, setTypefaces] = useState<Typeface[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(
    !initialStudios?.length
  );
  const [error, setError] = useState<string | null>(null);

  const fetchStudios = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/studios/display");
      if (!res.ok)
        throw new Error("Failed to fetch studios");
      const data: Studio[] = await res.json();
      setStudios(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to load typefaces"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialStudios?.length) {
      setStudios(initialStudios);
      setIsLoading(false);
    } else {
      fetchStudios();
    }
  }, [initialStudios, fetchStudios]);

  useEffect(() => {
    if (!studios?.length) {
      setTypefaces([]);
      return;
    }
    const mapped = studios.flatMap((studio) =>
      (studio.typefaces ?? []).map((typeface, index) => {
        const hash = studio.id
          .split("")
          .reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0
          );
        const studioGradient = Array.isArray(
          studio.gradient
        )
          ? studio.gradient[0]
          : "#FFF8E8";
        return {
          ...typeface,
          id: hash + index,
          category: typeface.category || [],
          hangeulName: typeface.hangeulName || "오흐탕크",
          gradient:
            "gradient" in typeface &&
            typeof typeface.gradient === "string"
              ? typeface.gradient
              : studioGradient,
          fonts: typeface.fonts.map((font) => ({
            ...font,
            price:
              "price" in font
                ? (font as { price: number }).price
                : 0,
            text:
              "text" in font
                ? (font as { text: string }).text
                : "",
          })),
        } as Typeface;
      })
    );
    setTypefaces(mapped);
  }, [studios]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center bg-light-gray">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 bg-light-gray">
        <p className="text-neutral-600">{error}</p>
        <button
          type="button"
          onClick={fetchStudios}
          className="rounded bg-black px-4 py-2 text-white hover:bg-neutral-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="w-full bg-light-gray py-20 md:py-32"
    >
      <div className="flex w-full flex-col gap-y-10 px-12">
        {Array.from(
          { length: Math.ceil(typefaces.length / 2) },
          (_, row) => {
            const first = typefaces[row * 2];
            const second = typefaces[row * 2 + 1];
            const isEvenRow = row % 2 === 0;

            return (
              <div
                key={first?.id ?? row}
                className="grid grid-cols-4 gap-x-5"
              >
                {first && (
                  <div
                    style={{
                      gridColumn: isEvenRow ? "1" : "2",
                    }}
                  >
                    <TypefaceCard
                      studioName={first.studio}
                      typeface={first}
                      compact={false}
                    />
                  </div>
                )}
                {second && (
                  <div
                    style={{
                      gridColumn: isEvenRow ? "3" : "4",
                    }}
                  >
                    <TypefaceCard
                      studioName={second.studio}
                      typeface={second}
                      compact={false}
                    />
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}
