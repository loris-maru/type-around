"use client";

import { useCallback, useRef, useState } from "react";
import {
  RiCloseLine,
  RiCompass2Line,
} from "react-icons/ri";
import TrackThumbVertical from "./track-thumb-vertical";

export type VerticalSliderProps = {
  id?: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  displayValue?: string;
  /** Dynamic color for label, track, thumb and value text (any CSS color) */
  color?: string;
  /** Controlled expanded state — when provided, only one slider can be expanded at a time */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
};

export default function VerticalSlider({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  displayValue,
  expanded: expandedProp,
  onExpandedChange,
}: VerticalSliderProps) {
  const [expandedInternal, setExpandedInternal] =
    useState(false);
  const isControlled = expandedProp !== undefined;
  const expanded = isControlled
    ? expandedProp
    : expandedInternal;
  const setExpanded = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onExpandedChange?.(value);
      } else {
        setExpandedInternal(value);
      }
    },
    [isControlled, onExpandedChange]
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fraction = (value - min) / (max - min);

  const clamp = useCallback(
    (v: number) => {
      const clamped = Math.min(max, Math.max(min, v));
      return Math.round(clamped / step) * step;
    },
    [min, max, step]
  );

  const getValueFromPointer = useCallback(
    (clientY: number) => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      // Bottom = min, top = max
      const ratio = (rect.bottom - clientY) / rect.height;
      return clamp(min + ratio * (max - min));
    },
    [min, max, value, clamp]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(
        e.pointerId
      );
      onChange(getValueFromPointer(e.clientY));
    },
    [onChange, getValueFromPointer]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      onChange(getValueFromPointer(e.clientY));
    },
    [onChange, getValueFromPointer]
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleLostPointerCapture = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className="relative flex flex-row items-end gap-1">
      {/* Label + compass button - when collapsed */}
      <div
        className="relative flex items-center justify-end gap-2"
        id="slider-label-block"
      >
        <label
          htmlFor={id}
          className="font-whisper text-black text-sm lg:text-xs"
        >
          {label}
        </label>
        {!expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label={`Expand ${label} slider`}
            aria-expanded={false}
            className="h-8 w-8 text-black transition-colors hover:bg-neutral-100"
          >
            <RiCompass2Line size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            aria-label={`Close ${label} slider`}
            className="h-8 w-8 text-black transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine size={16} />
          </button>
        )}
      </div>

      {/* Black container with track only - when expanded */}
      {expanded && (
        <div
          className="absolute right-0 flex touch-none flex-col items-center gap-1"
          id="slider-value-block"
          style={{ bottom: "calc(100% + 0.2rem)" }}
        >
          {/* Bottom row: label on left, value + close icon on right */}
          <div className="flex items-center gap-1 rounded-sm bg-white p-2 font-whisper text-black text-xs">
            {displayValue ?? value}
          </div>
          <TrackThumbVertical
            min={min}
            max={max}
            value={value}
            label={label}
            trackRef={trackRef}
            handlePointerDown={handlePointerDown}
            handlePointerMove={handlePointerMove}
            handlePointerUp={handlePointerUp}
            handleLostPointerCapture={
              handleLostPointerCapture
            }
            fraction={fraction}
          />
        </div>
      )}

      {/* Hidden native input for accessibility */}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        className="sr-only"
      />
    </div>
  );
}
