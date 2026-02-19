"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import type { SpecimenPageContextValue } from "@/types/specimen";

const SpecimenPageContext =
  createContext<SpecimenPageContextValue | null>(null);

export function SpecimenPageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedPageId, setSelectedPageId] = useState<
    string | null
  >(null);
  const [centerOnPageRequest, setCenterOnPageRequest] =
    useState<string | null>(null);

  const requestCenterOnPage = useCallback(
    (pageId: string) => {
      setCenterOnPageRequest(pageId);
    },
    []
  );

  const clearCenterOnPageRequest = useCallback(() => {
    setCenterOnPageRequest(null);
  }, []);

  const value: SpecimenPageContextValue = {
    selectedPageId,
    setSelectedPageId,
    centerOnPageRequest,
    requestCenterOnPage,
    clearCenterOnPageRequest,
  };

  return (
    <SpecimenPageContext.Provider value={value}>
      {children}
    </SpecimenPageContext.Provider>
  );
}

export function useSpecimenPage() {
  const context = useContext(SpecimenPageContext);
  if (!context) {
    throw new Error(
      "useSpecimenPage must be used within SpecimenPageProvider"
    );
  }
  return context;
}
