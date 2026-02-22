"use client";

import { useEffect } from "react";
import { useModalStore } from "@/stores/modal";

/**
 * Syncs modal open state to the global modal store.
 * Call this inside any modal component with its isOpen prop.
 */
export function useModalOpen(isOpen: boolean) {
  const openModal = useModalStore((s) => s.openModal);
  const closeModal = useModalStore((s) => s.closeModal);

  useEffect(() => {
    if (isOpen) {
      openModal();
      return () => closeModal();
    }
  }, [isOpen, openModal, closeModal]);
}
