"use client";

import CartoucheHeader from "@/components/molecules/home/cartouche-header";
import SVGAnimatedText from "@/components/molecules/home/svg-animated-text";
import { MotionValue } from "motion/react";
import { motion } from "motion/react";

interface HeaderHomeProps {
  svgScale: MotionValue<number>;
  opacity: MotionValue<number>;
}

export default function HeaderHome({ svgScale, opacity }: HeaderHomeProps) {
  return (
    <motion.div
      className="sticky top-0 w-full h-screen flex flex-row justify-between items-center overflow-hidden z-10 pointer-events-none"
      style={{ opacity }}
    >
      <motion.div
        className="absolute top-0 left-0 w-screen h-screen font-ortank text-[20vw] text-white flex items-center justify-center px-[6vw] pointer-events-none"
        style={{
          fontVariationSettings: '"wght" 900, "opsz" 100',
          scale: svgScale,
        }}
      >
        <div className="pointer-events-auto w-full h-full">
          <SVGAnimatedText />
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-0 w-full px-10 pb-10 pointer-events-auto">
        <CartoucheHeader />
      </div>
    </motion.div>
  );
}
