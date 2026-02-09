"use client";

import { useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Footer from "@/components/global/footer";
import HeaderHome from "@/components/segments/home/header";
import HighlightPoints from "@/components/segments/home/highlight-points";
import HorizontalSection from "@/components/segments/home/horizontal-section";
import Studios from "@/components/segments/home/studios";
import type { Studio } from "@/types/typefaces";

export default function HomeClient({
  studios,
}: {
  studios: Studio[];
}) {
  const { scrollYProgress } = useScroll();

  const svgScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 0.1]
  );
  const headerOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 0.5, 0]
  );

  return (
    <main className="relative w-full">
      <section className="relative flex h-screen w-full items-center justify-center bg-light-gray">
        <HeaderHome
          svgScale={svgScale}
          opacity={headerOpacity}
        />
      </section>

      <HorizontalSection />

      <HighlightPoints />

      <div className="relative mb-40 h-[80vh] w-full">
        <Image
          src="/mock/video_placeholder.jpg"
          alt="Video Placeholder"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
      </div>

      <Studios studios={studios} />

      <Footer />
    </main>
  );
}
