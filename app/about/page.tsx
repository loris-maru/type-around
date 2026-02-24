import type { Metadata } from "next";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER,
  SITE_NAME,
  SITE_URL,
} from "@/constant/SEO_METADATA";

export const metadata: Metadata = {
  title: "소개",
  description: `${SITE_NAME}를 소개합니다. 독립적인 한국 타입 팩토리를 지원하고 한글 타이포그래피의 미래를 이끌어갑니다.`,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    ...DEFAULT_OPEN_GRAPH,
    title: `소개 | ${SITE_NAME}`,
    description: `${SITE_NAME}를 소개합니다. 독립적인 한국 타입 팩토리를 지원합니다.`,
  },
  twitter: {
    ...DEFAULT_TWITTER,
    title: `소개 | ${SITE_NAME}`,
  },
};

export default function AboutPage() {
  return <div>AboutPage</div>;
}
