"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import IconTriangle from "@/components/icons/icon-triangle";
import type { Typeface } from "@/types/typefaces";
import { slugify } from "@/utils/slugify";
import SingleTypefaceLetter from "./single-typeface-letter";
import SingleTypefaceLetterMobile from "./single-typeface-letter-mobile";

const handleOrientation = (
  e: DeviceOrientationEvent,
  setGyroOffset: (vw: number) => void,
  setBeta: (b: number) => void
) => {
  const gamma = e.gamma ?? 0;
  const beta = e.beta ?? 0;
  const gammaClamped = Math.max(-90, Math.min(90, gamma));
  const vw = (gammaClamped / 90) * 50;
  setGyroOffset(vw);
  setBeta(beta);
};

export default function TypefaceHeader({
  studio,
  typeface,
  hangeulName = "오흐탕크",
}: {
  studio: string;
  typeface: Typeface;
  hangeulName: string;
}) {
  const [gyroOffset, setGyroOffset] = useState(0);
  const [beta, setBeta] = useState(0);
  const [permissionGranted, setPermissionGranted] =
    useState(false);

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

  useEffect(() => {
    if (!isMobile) return;

    const needsPermission =
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (
        DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>;
        }
      ).requestPermission === "function";

    if (!needsPermission) {
      queueMicrotask(() => setPermissionGranted(true));
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !permissionGranted) return;

    const handler = (e: DeviceOrientationEvent) =>
      handleOrientation(e, setGyroOffset, setBeta);
    window.addEventListener("deviceorientation", handler);
    return () =>
      window.removeEventListener(
        "deviceorientation",
        handler
      );
  }, [isMobile, permissionGranted]);

  const handleRequestMotion = useCallback(async () => {
    if (
      typeof DeviceOrientationEvent === "undefined" ||
      typeof (
        DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>;
        }
      ).requestPermission !== "function"
    ) {
      return;
    }
    try {
      const permission = await (
        DeviceOrientationEvent as unknown as {
          requestPermission: () => Promise<string>;
        }
      ).requestPermission();
      if (permission === "granted") {
        setPermissionGranted(true);
      }
    } catch {
      // Permission denied
    }
  }, []);

  const needsPermission =
    isMobile &&
    !permissionGranted &&
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof (
      DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      }
    ).requestPermission === "function";

  return (
    <div className="relative flex h-screen w-full flex-row items-center gap-x-10 px-[14vw]">
      <aside className="relative flex w-full flex-col items-center gap-2 lg:w-1/3">
        <div className="relative mb-2 flex flex-row items-center gap-4 font-ortank font-semibold text-black text-sm uppercase tracking-[2px]">
          <Link href={`/studio/${slugify(studio)}`}>
            {studio}
          </Link>
          <IconTriangle className="h-2 w-2" />
          {typeface.name}
        </div>
        <h1 className="whitespace-nowrap font-black font-ortank text-7xl">
          {hangeulName}
        </h1>
      </aside>
      <div
        className="absolute top-0 left-[50vw] h-full w-full transition-transform duration-100 lg:relative lg:left-0 lg:z-0 lg:w-2/3"
        style={
          isMobile &&
          (permissionGranted || !needsPermission)
            ? {
                transform: `translateX(calc(-50vw + ${gyroOffset}vw))`,
              }
            : undefined
        }
      >
        {isMobile ? (
          <SingleTypefaceLetterMobile
            typeface={typeface}
            beta={
              permissionGranted || !needsPermission
                ? beta
                : 0
            }
          />
        ) : (
          <SingleTypefaceLetter typeface={typeface} />
        )}
      </div>
      {needsPermission && (
        <button
          type="button"
          onClick={handleRequestMotion}
          aria-label="Enable motion to tilt the letter with your device"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black px-4 py-2 font-whisper text-white text-xs transition-opacity hover:opacity-80 lg:hidden"
        >
          Tap to enable motion
        </button>
      )}
    </div>
  );
}
