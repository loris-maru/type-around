"use client";

import { useEffect } from "react";

// Store the truly original console.error once, before any HMR re-mounts
const nativeConsoleError =
  typeof window !== "undefined" ? console.error : undefined;

export function ErrorLogger({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!nativeConsoleError) return;

    // Always restore from the native reference to avoid chaining wrappers
    console.error = (
      ...args: Parameters<typeof console.error>
    ) => {
      nativeConsoleError.apply(console, args);
      if (process.env.NODE_ENV === "development") {
        console.warn("🔴 ERROR DETECTED:", ...args);
      }
    };

    const handleError = (event: ErrorEvent) => {
      console.warn("🔴 UNCAUGHT ERROR:", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    };

    const handleUnhandledRejection = (
      event: PromiseRejectionEvent
    ) => {
      console.warn("🔴 UNHANDLED PROMISE REJECTION:", {
        reason: event.reason,
        promise: event.promise,
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener(
      "unhandledrejection",
      handleUnhandledRejection
    );

    return () => {
      console.error = nativeConsoleError;
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  return <>{children}</>;
}
