"use client";

import { StudioFontsProvider } from "@/contexts/studio-fonts-context";

type StudioPublicPageProps = {
  /** Display font URL (`headerFont` from account → studio-page) */
  headerFont?: string;
  /** Text font URL (`textFont` from account → studio-page) */
  textFont?: string;
  children: React.ReactNode;
};

/**
 * Loads studio display & text fonts via useFont (@react-hooks-library/core)
 * and provides them to the public studio page through StudioFontsProvider.
 */
export default function StudioPublicPage({
  headerFont,
  textFont,
  children,
}: StudioPublicPageProps) {
  return (
    <StudioFontsProvider
      displayFontUrl={headerFont || undefined}
      textFontUrl={textFont || undefined}
    >
      {children}
    </StudioFontsProvider>
  );
}
