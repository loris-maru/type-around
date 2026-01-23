"use client";

import Image from "next/image";
import HorizontalSection from "@/components/segments/home/horizontal-section";
import HeaderHome from "@/components/segments/home/header";
import { useScroll, useTransform } from "motion/react";
import Footer from "@/components/global/footer";
import HighlightPoints from "@/components/segments/home/highlight-points";
import Studios from "@/components/segments/home/studios";

export default function Home() {
  const { scrollYProgress } = useScroll();

  // Scale down SVGAnimatedText from 1 to 0.1 as user scrolls
  const svgScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 0.1]
  );
  // Fade out HeaderHome as user scrolls
  const headerOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 0.5, 0]
  );

  return (
    <main className="relative w-full">
      {/* Hero Section - 100vh */}
      <section className="relative h-screen w-full flex items-center justify-center bg-light-gray">
        <HeaderHome
          svgScale={svgScale}
          opacity={headerOpacity}
        />
      </section>

      {/* Horizontal Section - 300vh with sticky scroll */}
      <HorizontalSection />

      <HighlightPoints />

      <div className="relative w-full h-[80vh] mb-40">
        <Image
          src="/mock/video_placeholder.jpg"
          alt="Video Placeholder"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
      </div>

      <Studios />

      {/* Footer Section - 100vh */}
      <Footer />
    </main>
  );
}
