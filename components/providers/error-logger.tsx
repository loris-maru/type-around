"use client";

import { useEffect } from "react";

export function ErrorLogger({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      originalError.apply(console, args);
      // Log to a more visible place during development
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
      console.error = originalError;
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  return <>{children}</>;
}
