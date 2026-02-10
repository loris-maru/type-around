"use client";

import { useCallback, useRef } from "react";

export type SliderProps = {
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
};

export default function Slider({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  displayValue,
  color = "#000000",
}: SliderProps) {
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
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
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
      onChange(getValueFromPointer(e.clientX));
    },
    [onChange, getValueFromPointer]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      onChange(getValueFromPointer(e.clientX));
    },
    [onChange, getValueFromPointer]
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className="flex flex-1 items-center gap-3">
      <label
        htmlFor={id}
        className="shrink-0 font-whisper text-xs"
        style={{ color }}
      >
        {label}
      </label>

      {/* Custom track */}
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        tabIndex={0}
        ref={trackRef}
        className="relative h-5 flex-1 cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Track line (30% opacity of the color) */}
        <div
          className="absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2 rounded-full"
          style={{ backgroundColor: color, opacity: 0.3 }}
        />
        {/* Filled portion */}
        <div
          className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 rounded-full"
          style={{
            width: `${fraction * 100}%`,
            backgroundColor: color,
          }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${fraction * 100}%`,
            backgroundColor: color,
          }}
        />
      </div>

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

      <span
        className="w-10 shrink-0 text-right font-whisper text-xs"
        style={{ color }}
      >
        {displayValue ?? value}
      </span>
    </div>
  );
}
