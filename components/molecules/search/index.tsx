"use client";

import Fuse from "fuse.js";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RiSearchLine } from "react-icons/ri";
import {
  SEARCH_TYPE_ICON,
  SEARCH_TYPE_LABEL,
} from "@/constant/SEARCH";
import type {
  SearchableItem,
  SearchPanelProps,
} from "@/types/search";

export default function SearchPanel({
  isOpen,
  onClose,
}: SearchPanelProps) {
  const [queryStr, setQueryStr] = useState("");
  const [items, setItems] = useState<SearchableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch the search index once when opened
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    async function fetchItems() {
      setLoading(true);
      try {
        const res = await fetch("/api/search");
        const data = await res.json();
        if (!cancelled) setItems(data);
      } catch (err) {
        console.error("Failed to fetch search items:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchItems();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Focus the input when opened
  useEffect(() => {
    if (isOpen) {
      // Small delay to let the animation start
      const t = setTimeout(
        () => inputRef.current?.focus(),
        150
      );
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      return () =>
        document.removeEventListener("keydown", handleKey);
    }
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
      return () =>
        document.removeEventListener(
          "mousedown",
          handleClick
        );
    }
  }, [isOpen, onClose]);

  // Build Fuse index (name + meta + searchMeta for typeface vision)
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "name", weight: 1 },
          { name: "meta", weight: 0.4 },
          { name: "searchMeta", weight: 0.5 },
        ],
        threshold: 0.35,
        includeScore: true,
      }),
    [items]
  );

  const results = useMemo(() => {
    if (!queryStr.trim()) return [];
    return fuse
      .search(queryStr, { limit: 12 })
      .map((r) => r.item);
  }, [fuse, queryStr]);

  const handleLinkClick = useCallback(() => {
    setQueryStr("");
    onClose();
  }, [onClose]);

  // Reset query on close
  useEffect(() => {
    if (!isOpen) setQueryStr("");
  }, [isOpen]);

  const hasResults = results.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
          className="fixed top-[60px] right-5 left-5 z-50 mx-auto max-w-2xl overflow-hidden rounded-xl border border-medium-gray bg-white"
        >
          {/* Search input */}
          <div className="flex items-center gap-3 border-medium-gray border-b px-5 py-4">
            <RiSearchLine
              size={20}
              className="shrink-0 text-dark-gray"
            />
            <input
              ref={inputRef}
              type="search"
              value={queryStr}
              onChange={(e) => setQueryStr(e.target.value)}
              placeholder="Search typefaces, studios, designers…"
              aria-label="Search typefaces, studios, and designers"
              className="w-full bg-transparent font-whisper text-base text-black outline-none placeholder:text-medium-gray"
            />
            {queryStr && (
              <button
                type="button"
                onClick={() => setQueryStr("")}
                className="shrink-0 font-whisper text-medium-gray text-xs transition-colors hover:text-black"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="px-5 py-6 text-center font-whisper text-medium-gray text-sm">
                Loading…
              </div>
            )}

            {!loading && queryStr.trim() && !hasResults && (
              <div className="px-5 py-6 text-center font-whisper text-medium-gray text-sm">
                No results for &ldquo;{queryStr}&rdquo;
              </div>
            )}

            {!loading && hasResults && (
              <div className="py-2">
                {results.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-light-gray"
                  >
                    <span className="text-dark-gray">
                      {SEARCH_TYPE_ICON[item.type]}
                    </span>
                    <div className="flex min-w-0 flex-1 items-baseline gap-2">
                      <span className="font-bold font-whisper text-base text-black">
                        {item.name}
                      </span>
                      {item.type === "typeface" &&
                        item.meta && (
                          <span className="truncate font-normal font-whisper text-neutral-500 text-sm">
                            {item.meta}
                          </span>
                        )}
                    </div>
                    <span className="font-medium font-whisper text-[11px] text-medium-gray uppercase tracking-wider">
                      {SEARCH_TYPE_LABEL[item.type]}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {!loading &&
              !queryStr.trim() &&
              items.length > 0 && (
                <div className="px-5 py-6 text-center font-whisper text-medium-gray text-sm">
                  Start typing to search…
                </div>
              )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
