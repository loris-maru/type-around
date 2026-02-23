import type { RefObject } from "react";

export type TrackThumbVerticalProps = {
  min: number;
  max: number;
  value: number;
  label: string;
  trackRef: RefObject<HTMLDivElement | null>;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  handleLostPointerCapture: () => void;
  fraction: number;
};
