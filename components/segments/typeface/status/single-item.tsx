"use client";

import { CircleDiagramProps } from "@/types/diagram";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export default function SingleItem({
  label,
  value,
  max,
  size = 150,
  strokeWidthFat = 10,
  strokeWidthThin = 1,
  color = "#000000",
}: CircleDiagramProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 1,
  });

  const radius = (size - strokeWidthFat) / 2;
  const circumference = 2 * Math.PI * radius;

  const percentage = Math.max(
    0,
    Math.min(100, (value / max) * 100)
  );

  return (
    <div
      ref={ref}
      className="relative w-full flex flex-col items-center"
    >
      <div className="relative font-ortank font-bold text-2xl mb-1">
        {label}
      </div>

      <div className="relative font-whisper text-base font-normal text-back mb-2">
        {value} / {max}
      </div>

      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background Circle (Thin Stroke) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidthThin}
            className="text-gray-200 dark:text-gray-800"
          />

          {/* Foreground Circle (Fat Stroke with Motion) */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidthFat}
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={
              isInView
                ? {
                    strokeDashoffset:
                      circumference -
                      (percentage / 100) * circumference,
                  }
                : { strokeDashoffset: circumference }
            }
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
      </div>
    </div>
  );
}
