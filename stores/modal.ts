import { create } from "zustand";

type ModalStore = {
  openCount: number;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  openCount: 0,
  isModalOpen: false,
  openModal: () =>
    set((state) => ({
      openCount: state.openCount + 1,
      isModalOpen: true,
    })),
  closeModal: () =>
    set((state) => {
      const next = Math.max(0, state.openCount - 1);
      return {
        openCount: next,
        isModalOpen: next > 0,
      };
    }),
}));
