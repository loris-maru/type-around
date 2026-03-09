import type { Metadata } from "next";
import LayoutRoot from "@/components/layout/layout-root";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/constant/SEO_METADATA";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – 독립적인 한국 타입 팩토리의 미래`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "한국 글꼴",
    "한글 폰트",
    "독립 타입 팩토리",
    "한국 타이포그래피",
    "글자곁",
    "글자궤도",
    "타이포그래피 디자인",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    ...DEFAULT_OPEN_GRAPH,
    url: SITE_URL,
    title: `${SITE_NAME} – 독립적인 한국 타입 팩토리의 미래`,
    description: SITE_DESCRIPTION,
  },
  twitter: DEFAULT_TWITTER,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL, // Default for homepage; child pages override with their own URL
  },
  verification: {
    ...(process.env
      .NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      google:
        process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutRoot>{children}</LayoutRoot>;
}
