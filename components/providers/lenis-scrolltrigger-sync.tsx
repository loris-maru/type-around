"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

/**
 * Syncs Lenis smooth scroll with GSAP ScrollTrigger.
 * Must be mounted inside ReactLenis (SmoothScrollProvider).
 */
export default function LenisScrollTriggerSync() {
  const lenis = useLenis();
  const registered = useRef(false);

  useEffect(() => {
    if (!registered.current) {
      gsap.registerPlugin(ScrollTrigger);
      registered.current = true;
    }

    if (!lenis) return;

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value?: number) {
        if (value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const unsubscribe = lenis.on(
      "scroll",
      ScrollTrigger.update
    );

    return () => {
      unsubscribe();
      ScrollTrigger.scrollerProxy(document.body, {});
    };
  }, [lenis]);

  return null;
}
