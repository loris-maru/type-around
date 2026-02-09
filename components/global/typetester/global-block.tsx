"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  RiCloseFill,
  RiDeleteBinLine,
  RiListSettingsLine,
} from "react-icons/ri";
import type {
  GlobalTypetesterBlockProps,
  TypetesterParams,
} from "@/types/typetester";
import { cn } from "@/utils/class-names";
import { GroupedFontDropdown } from "./parameters";
import TypetesterParameters from "./parameters";

export default function GlobalTypetesterBlock({
  placeholder = "가을 하늘 공활한데 높고 구름 없이 밝은 달은 우리 가슴 일편단심일세.",
  canDelete = false,
  onDelete,
  typefaces = [],
}: GlobalTypetesterBlockProps) {
  const allFonts = useMemo(
    () => typefaces.flatMap((tf) => tf.fonts),
    [typefaces]
  );

  // Pick default font: weight 400 (Regular) or first available
  const defaultFontId = useMemo(() => {
    const regular = allFonts.find(
      (f) => f.weight === 400 && !f.isItalic
    );
    return regular?.id || allFonts[0]?.id || "";
  }, [allFonts]);

  const [params, setParams] = useState<TypetesterParams>({
    fontSize: 80,
    lineHeight: 1.2,
    letterSpacing: 0,
    textAlign: "left",
    fontId: defaultFontId,
    backgroundColor: "#FFFFFF",
    fontColor: "#000000",
  });
  const [showParams, setShowParams] = useState(false);

  // Load selected font as @font-face
  const selectedFont = useMemo(
    () => allFonts.find((f) => f.id === params.fontId),
    [allFonts, params.fontId]
  );

  const fontFamily = useMemo(() => {
    if (!selectedFont?.file) return "";
    return `tt-font-${selectedFont.id}`;
  }, [selectedFont]);

  useEffect(() => {
    if (!selectedFont?.file) return;

    const familyName = `tt-font-${selectedFont.id}`;

    const existing = Array.from(document.fonts).find(
      (f) => f.family === familyName
    );

    if (existing) return;

    let cancelled = false;

    const face = new FontFace(
      familyName,
      `url(${selectedFont.file})`,
      {
        weight: String(selectedFont.weight),
        style: selectedFont.isItalic ? "italic" : "normal",
      }
    );

    face
      .load()
      .then((loaded) => {
        if (!cancelled) {
          document.fonts.add(loaded);
        }
      })
      .catch(() => {
        // Font loading failed
      });

    return () => {
      cancelled = true;
    };
  }, [selectedFont]);

  const toggleParams = useCallback(() => {
    setShowParams((prev) => !prev);
  }, []);

  const updateFontId = useCallback((id: string) => {
    setParams((prev) => ({ ...prev, fontId: id }));
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      style={{
        backgroundColor: params.backgroundColor,
        color: params.fontColor,
      }}
    >
      {/* Top bar: font selector + info (always visible) + action buttons */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2">
          {typefaces.length > 0 && (
            <GroupedFontDropdown
              typefaces={typefaces}
              selectedId={params.fontId}
              onChange={updateFontId}
            />
          )}
          <span className="font-normal font-whisper text-neutral-500 text-xs">
            — {params.fontSize}px
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!showParams && canDelete && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
              aria-label="Delete block"
            >
              <RiDeleteBinLine size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={toggleParams}
            className={cn(
              "rounded-md p-2 transition-colors",
              showParams
                ? "bg-black text-white"
                : "text-neutral-400 hover:bg-neutral-100 hover:text-black"
            )}
            aria-label="Toggle type settings"
          >
            {showParams ? (
              <RiCloseFill size={18} />
            ) : (
              <RiListSettingsLine size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Parameters panel - slides in from top */}
      <AnimatePresence>
        {showParams && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className="absolute top-0 right-0 left-0 z-5 border-neutral-200 border-b bg-white/95 backdrop-blur-sm"
          >
            <TypetesterParameters
              params={params}
              onChange={setParams}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editable text area */}
      {/* biome-ignore lint/a11y/useSemanticElements: contentEditable div is required for rich inline editing */}
      <div
        className={cn(
          "h-full w-full px-8 pb-14 outline-none transition-[padding-top] duration-300",
          showParams ? "pt-[calc(2rem+60px)]" : "pt-8"
        )}
        contentEditable
        role="textbox"
        tabIndex={0}
        aria-label="Editable typography preview text"
        aria-multiline="true"
        suppressContentEditableWarning
        style={{
          fontSize: `${params.fontSize}px`,
          lineHeight: params.lineHeight,
          letterSpacing: `${params.letterSpacing}px`,
          textAlign: params.textAlign,
          fontFamily: fontFamily || undefined,
        }}
      >
        {placeholder}
      </div>
    </div>
  );
}
