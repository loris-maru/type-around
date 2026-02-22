"use client";

import { useLenis } from "lenis/react";
import { useEffect } from "react";
import { useModalStore } from "@/stores/modal";

/**
 * When any modal is open:
 * - Stops Lenis smooth scroll (background no longer scrollable)
 * - Applies overflow: hidden to html/body as fallback
 * - Modals use data-lenis-prevent so their content can scroll natively
 */
export default function ModalScrollLock() {
  const isModalOpen = useModalStore((s) => s.isModalOpen);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    if (isModalOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isModalOpen, lenis]);

  useEffect(() => {
    if (!isModalOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [isModalOpen]);

  return null;
}
