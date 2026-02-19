"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSpecimenPage } from "@/contexts/specimen-page-context";
import { useStudio } from "@/hooks/use-studio";
import type { SpecimenPageWorkspaceProps } from "@/types/specimen";
import type { SpecimenPage } from "@/types/studio";
import SinglePage from "./single-page";

const MIN_SCALE = 0.05;
const MAX_SCALE = 2;
const SCALE_STEP = 0.1;

export default function SpecimenPageWorkspace({
  specimenId,
}: SpecimenPageWorkspaceProps) {
  const { studio } = useStudio();
  const { centerOnPageRequest, clearCenterOnPageRequest } =
    useSpecimenPage();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pageRefsMap = useRef<Map<string, HTMLDivElement>>(
    new Map()
  );
  const [scale, setScale] = useState(0.1);
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0,
  });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({
    x: 0,
    y: 0,
    translateX: 0,
    translateY: 0,
  });

  const specimen = useMemo(
    () =>
      studio?.specimens?.find((s) => s.id === specimenId),
    [studio?.specimens, specimenId]
  );

  const format = specimen?.format ?? "A4";
  const orientation = specimen?.orientation ?? "portrait";
  const pages: SpecimenPage[] = useMemo(() => {
    const p = specimen?.pages ?? [];
    return p.length > 0
      ? p
      : [{ id: "placeholder", name: "Page 1" }];
  }, [specimen?.pages]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!e.metaKey) return;
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        translateX: translate.x,
        translateY: translate.y,
      };
    },
    [translate]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning) return;
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setTranslate({
        x: panStartRef.current.translateX + dx,
        y: panStartRef.current.translateY + dy,
      });
    },
    [isPanning]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (isPanning) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener(
          "mousemove",
          handleMouseMove
        );
        window.removeEventListener(
          "mouseup",
          handleMouseUp
        );
      };
    }
  }, [isPanning, handleMouseMove, handleMouseUp]);

  // Native wheel listener with passive: false so preventDefault works for Cmd+wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.metaKey) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
      setScale((s) =>
        Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta))
      );
    };
    el.addEventListener("wheel", onWheel, {
      passive: false,
    });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Center on page when requested
  useEffect(() => {
    if (
      !centerOnPageRequest ||
      !containerRef.current ||
      !contentRef.current
    )
      return;
    const pageEl = pageRefsMap.current.get(
      centerOnPageRequest
    );
    if (!pageEl) {
      clearCenterOnPageRequest();
      return;
    }
    const container = containerRef.current;
    const vw = container.clientWidth;
    const vh = container.clientHeight;
    const pageRect = pageEl.getBoundingClientRect();
    // Page center in viewport coords (accounting for current transform)
    const pageCenterX = pageRect.left + pageRect.width / 2;
    const pageCenterY = pageRect.top + pageRect.height / 2;
    // Viewport center
    const viewCenterX =
      container.getBoundingClientRect().left + vw / 2;
    const viewCenterY =
      container.getBoundingClientRect().top + vh / 2;
    // Delta to move page center to viewport center
    const dx = viewCenterX - pageCenterX;
    const dy = viewCenterY - pageCenterY;
    setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
    clearCenterOnPageRequest();
  }, [centerOnPageRequest, clearCenterOnPageRequest]);

  const setPageRef = useCallback(
    (pageId: string, el: HTMLDivElement | null) => {
      if (el) pageRefsMap.current.set(pageId, el);
      else pageRefsMap.current.delete(pageId);
    },
    []
  );

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Specimen page workspace. Hold Cmd and drag to pan, Cmd and scroll to zoom."
      className="fixed inset-0 z-0 overflow-hidden bg-neutral-100"
      style={{
        width: "100vw",
        height: "100vh",
        cursor: isPanning ? "grabbing" : "default",
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={contentRef}
        className="flex origin-top-left flex-col items-center gap-8 p-8"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        {(pages.some((p) => p.id === "placeholder")
          ? [{ id: "placeholder", name: "Page 1" }]
          : pages
        ).map((page) => (
          <div
            key={page.id}
            ref={(el) => setPageRef(page.id, el)}
            data-page-id={page.id}
          >
            <SinglePage
              page={page}
              format={format}
              orientation={orientation}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
