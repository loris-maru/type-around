"use client";

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
  SingleTypetesterBlockProps,
  TypetesterParams,
} from "@/types/typetester";
import { cn } from "@/utils/class-names";
import { FontDropdown } from "./parameters";
import TypetesterParameters from "./parameters";

export default function SingleTypetesterBlock({
  placeholder = "가을 하늘 공활한데 높고 구름 없이 밝은 달은 우리 가슴 일편단심일세.",
  canDelete = false,
  onDelete,
  fonts = [],
}: SingleTypetesterBlockProps) {
  // Pick default font: weight 400 (Regular) or first available
  const defaultFontId = useMemo(() => {
    const regular = fonts.find(
      (f) => f.weight === 400 && !f.isItalic
    );
    return regular?.id || fonts[0]?.id || "";
  }, [fonts]);

  const [params, setParams] = useState<TypetesterParams>({
    fontSize: 120,
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
    () => fonts.find((f) => f.id === params.fontId),
    [fonts, params.fontId]
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
      className="relative min-h-[180px] w-full overflow-hidden rounded-lg"
      style={{
        backgroundColor: params.backgroundColor,
        color: params.fontColor,
      }}
    >
      {/* Top bar */}
      <div className="relative z-10 flex items-center gap-4 px-5 pt-4">
        {/* When params closed: font selector + size */}
        {!showParams && (
          <div className="flex flex-1 items-center gap-2">
            {fonts.length > 0 && (
              <FontDropdown
                fonts={fonts}
                selectedId={params.fontId}
                onChange={updateFontId}
              />
            )}
            <span className="font-normal font-whisper text-neutral-500 text-xs">
              — {params.fontSize}px
            </span>
          </div>
        )}

        {/* When params open: inline parameter controls */}
        {showParams && (
          <div className="flex-1">
            <TypetesterParameters
              params={params}
              onChange={setParams}
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-1">
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

      {/* Font selector + info bar — visible below params when open */}
      {showParams && (
        <div className="flex items-center gap-2 px-5 pt-3">
          {fonts.length > 0 && (
            <FontDropdown
              fonts={fonts}
              selectedId={params.fontId}
              onChange={updateFontId}
            />
          )}
          <span className="font-normal font-whisper text-neutral-500 text-xs">
            — {params.fontSize}px
          </span>
        </div>
      )}

      {/* Editable text area */}
      {/* biome-ignore lint/a11y/useSemanticElements: contentEditable div is required for rich inline editing */}
      <div
        className="w-full px-8 pt-4 pb-14 outline-none"
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
