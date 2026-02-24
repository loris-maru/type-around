import type { Metadata } from "next";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER,
  SITE_NAME,
  SITE_URL,
} from "@/constant/SEO_METADATA";

export const metadata: Metadata = {
  title: "전체 글꼴",
  description: `독립적인 팩토리의 한국 글꼴을 둘러보세요. ${SITE_NAME}에서 카테고리와 스튜디오별로 필터링하세요.`,
  alternates: { canonical: `${SITE_URL}/typefaces` },
  openGraph: {
    ...DEFAULT_OPEN_GRAPH,
    title: `전체 글꼴 | ${SITE_NAME}`,
    description:
      "독립적인 팩토리의 한국 글꼴을 둘러보세요.",
  },
  twitter: {
    ...DEFAULT_TWITTER,
    title: `전체 글꼴 | ${SITE_NAME}`,
  },
};

export default function TypefacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
