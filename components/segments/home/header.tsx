"use client";

import { motion } from "motion/react";
import CartoucheHeader from "@/components/molecules/home/cartouche-header";
import SVGAnimatedText from "@/components/molecules/home/svg-animated-text";
import type { HeaderHomeProps } from "@/types/components";

export default function HeaderHome({
  svgScale,
  opacity,
}: HeaderHomeProps) {
  return (
    <motion.div
      className="pointer-events-none sticky top-0 z-10 flex h-screen w-full flex-row items-center justify-between overflow-hidden"
      style={{ opacity }}
    >
      <motion.div
        className="pointer-events-none absolute top-0 left-0 flex h-screen w-screen items-center justify-center px-[6vw] font-ortank text-[20vw] text-white"
        style={{
          fontVariationSettings: '"wght" 900, "opsz" 100',
          scale: svgScale,
        }}
      >
        <div className="pointer-events-auto h-full w-full">
          <SVGAnimatedText />
        </div>
      </motion.div>
      <div className="pointer-events-auto absolute bottom-0 left-0 w-full px-10 pb-10">
        <CartoucheHeader />
      </div>
    </motion.div>
  );
}
