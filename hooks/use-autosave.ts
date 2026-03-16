"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const DEBOUNCE_MS = 1500;

type UseAutosaveOptions<T> = {
  storageKey: string;
  data: T;
  saveFn: (data: T) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
};

export function useAutosave<
  T extends Record<string, unknown>,
>({
  storageKey,
  data,
  saveFn,
  debounceMs = DEBOUNCE_MS,
  enabled = true,
}: UseAutosaveOptions<T>) {
  const [showSaved, setShowSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(
    null
  );
  const saveTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const prevDataRef = useRef<string | null>(null);
  const hasUserChanged = useRef(false);
  const saveFnRef = useRef(saveFn);
  const dataRef = useRef(data);

  useEffect(() => {
    saveFnRef.current = saveFn;
    dataRef.current = data;
  }, [saveFn, data]);

  const triggerSavedPill = useCallback(() => {
    setSaveError(null);
    setShowSaved(true);
    const timer = setTimeout(
      () => setShowSaved(false),
      4000
    );
    return () => clearTimeout(timer);
  }, []);

  const flush = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    if (!hasUserChanged.current || !storageKey) return;
    const toSave = dataRef.current;
    try {
      await saveFnRef.current(toSave);
      hasUserChanged.current = false;
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Ignore
      }
      triggerSavedPill();
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Failed to save"
      );
      // Keep draft in localStorage for retry
    }
  }, [storageKey, triggerSavedPill]);

  const retry = useCallback(() => {
    setSaveError(null);
    flush();
  }, [flush]);

  // Save to localStorage on every change (immediate persistence)
  useEffect(() => {
    if (!storageKey) return;

    const dataStr = JSON.stringify(data);
    if (dataStr === prevDataRef.current) return;
    prevDataRef.current = dataStr;
    hasUserChanged.current = true;

    try {
      localStorage.setItem(storageKey, dataStr);
    } catch {
      // Ignore quota errors
    }
  }, [data, storageKey]);

  // Debounced save to Firebase (data in deps resets timer on change)
  useEffect(() => {
    void data; // Intentional: resets debounce timer when data changes
    if (!enabled || !hasUserChanged.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveTimeoutRef.current = null;
      flush();
    }, debounceMs);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, debounceMs, enabled, flush]);

  // Flush on unmount (user navigates away) - read from localStorage
  // to get latest data (may be newer than dataRef if user navigated
  // before next render)
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      if (!hasUserChanged.current || !storageKey) return;
      try {
        const stored = localStorage.getItem(storageKey);
        const toSave = stored
          ? (JSON.parse(stored) as T)
          : dataRef.current;
        saveFnRef.current(toSave).catch(() => {
          // Fire-and-forget; draft stays in localStorage
        });
      } catch {
        saveFnRef.current(dataRef.current).catch(() => {});
      }
    };
  }, [storageKey]);

  // Flush when tab becomes hidden (user switches tab or minimizes)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = null;
        }
        if (!hasUserChanged.current || !storageKey) return;
        try {
          const stored = localStorage.getItem(storageKey);
          const toSave = stored
            ? (JSON.parse(stored) as T)
            : dataRef.current;
          saveFnRef.current(toSave).catch(() => {});
        } catch {
          saveFnRef
            .current(dataRef.current)
            .catch(() => {});
        }
      }
    };
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
    return () =>
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
  }, [storageKey]);

  return {
    showSaved,
    saveError,
    retry,
    triggerSaved: triggerSavedPill,
    setSaveError,
  };
}
