import type { Metadata } from "next";
import { SITE_NAME } from "@/constant/SEO_METADATA";

export const metadata: Metadata = {
  title: "주문",
  description: `${SITE_NAME}에서 구매한 글꼴을 다운로드하세요.`,
  robots: { index: false, follow: false },
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
