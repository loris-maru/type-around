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
  GlobalTypetesterBlockProps,
  TypetesterParams,
} from "@/types/typetester";
import { cn } from "@/utils/class-names";
import TypetesterParameters, {
  GroupedFontDropdown,
} from "./parameters";

export default function GlobalTypetesterBlock({
  placeholder = "가을 하늘 공활한데 높고 구름 없이 밝은 달은 우리 가슴 일편단심일세.",
  canDelete = false,
  onDelete,
  typefaces = [],
  initialBackgroundColor,
  initialFontColor,
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
    backgroundColor: initialBackgroundColor || "#FFFFFF",
    fontColor: initialFontColor || "#000000",
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
    <>
      <div
        className="relative w-full rounded-lg"
        style={{
          backgroundColor: params.backgroundColor,
          color: params.fontColor,
        }}
      >
        {/* Top bar */}
        <div className="relative z-10 flex items-center gap-4 overflow-visible px-5 pt-4">
          {/* Font selector */}
          <div className="flex items-center gap-2">
            {typefaces.length > 0 && (
              <GroupedFontDropdown
                typefaces={typefaces}
                selectedId={params.fontId}
                onChange={updateFontId}
              />
            )}
            <span className="font-normal font-whisper text-base text-neutral-500 lg:hidden lg:text-xs">
              — {params.fontSize}px
            </span>
          </div>

          {/* Desktop: always-visible parameters */}
          <div className="hidden flex-1 lg:flex">
            <TypetesterParameters
              params={params}
              onChange={setParams}
              variant="desktop"
            />
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 items-center gap-1">
            {canDelete && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                aria-label="Delete block"
              >
                <RiDeleteBinLine size={18} />
              </button>
            )}
            {/* Tablet/mobile only: toggle params button */}
            <button
              type="button"
              onClick={toggleParams}
              className={cn(
                "rounded-md p-2 transition-colors lg:hidden",
                showParams
                  ? "bg-black text-white"
                  : "text-black hover:bg-neutral-100 hover:text-black"
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

        {/* Editable text area - overflow-hidden for rounded corners clipping */}
        {/* biome-ignore lint/a11y/useSemanticElements: contentEditable div is required for rich inline editing */}
        <div
          className="typetester-text-responsive h-full w-full overflow-hidden rounded-b-lg px-8 pt-4 pb-14 outline-none"
          contentEditable
          role="textbox"
          tabIndex={0}
          aria-label="Editable typography preview text"
          aria-multiline="true"
          suppressContentEditableWarning
          style={
            {
              "--tt-fs-mobile": `${params.fontSizeMobile ?? Math.round(params.fontSize * 0.55)}px`,
              "--tt-fs-tablet": `${params.fontSizeTablet ?? Math.round(params.fontSize * 0.9)}px`,
              "--tt-fs-desktop": `${params.fontSize}px`,
              "--tt-fs-super-desktop": `${params.fontSizeSuperDesktop ?? Math.round(params.fontSize * 1.25)}px`,
              lineHeight: params.lineHeight,
              letterSpacing: `${params.letterSpacing}px`,
              textAlign: params.textAlign,
              fontFamily: fontFamily || undefined,
            } as React.CSSProperties
          }
        >
          {placeholder}
        </div>
      </div>

      {/* Mobile: fixed bottom overlay when params open — overflow-visible so VerticalSlider expand popup isn't clipped */}
      {showParams && (
        <div className="fixed bottom-0 left-0 z-99999 w-screen overflow-visible bg-white p-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:hidden">
          <TypetesterParameters
            params={params}
            onChange={setParams}
            variant="mobile"
          />
        </div>
      )}
    </>
  );
}
