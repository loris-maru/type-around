"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import type {
  SelectedCell,
  SpecimenPageContextValue,
  SpecimenSelectionAttributes,
} from "@/types/specimen";

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
  const [selectedCell, setSelectedCell] =
    useState<SelectedCell | null>(null);
  const [activeEditor, setActiveEditor] =
    useState<unknown>(null);
  const [selectionAttributes, setSelectionAttributes] =
    useState<SpecimenSelectionAttributes | null>(null);
  const [storedSelectionRange, setStoredSelectionRange] =
    useState<{
      from: number;
      to: number;
    } | null>(null);
  const [saveActiveCellContent, setSaveActiveCellContent] =
    useState<(() => void) | null>(null);
  const [centerOnPageRequest, setCenterOnPageRequest] =
    useState<string | null>(null);
  const [isTemplatePickerOpen, setTemplatePickerOpen] =
    useState(false);

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
    selectedCell,
    setSelectedCell,
    activeEditor,
    setActiveEditor,
    selectionAttributes,
    setSelectionAttributes,
    storedSelectionRange,
    setStoredSelectionRange,
    saveActiveCellContent,
    setSaveActiveCellContent,
    centerOnPageRequest,
    requestCenterOnPage,
    clearCenterOnPageRequest,
    isTemplatePickerOpen,
    setTemplatePickerOpen,
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
