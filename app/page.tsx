"use client";

import HorizontalSection from "@/components/segments/home/horizontal-section";
import HeaderHome from "@/components/segments/home/header";
import { useScroll, useTransform } from "motion/react";
import Footer from "@/components/global/footer";

export default function Home() {
  const { scrollYProgress } = useScroll();

  // Scale down SVGAnimatedText from 1 to 0.1 as user scrolls
  const svgScale = useTransform(scrollYProgress, [0, 1], [1, 0.1]);
  // Fade out HeaderHome as user scrolls
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <main className="relative w-full bg-light-gray">
      {/* Hero Section - 100vh */}
      <section className="relative h-screen w-full flex items-center justify-center bg-light-gray">
        <HeaderHome svgScale={svgScale} opacity={headerOpacity} />
      </section>

      {/* Horizontal Section - 300vh with sticky scroll */}
      <HorizontalSection />

      {/* Footer Section - 100vh */}
      <Footer />
    </main>
  );
}
