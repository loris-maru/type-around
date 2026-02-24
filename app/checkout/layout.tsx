import type { Metadata } from "next";
import { SITE_NAME } from "@/constant/SEO_METADATA";

export const metadata: Metadata = {
  title: "결제",
  description: `${SITE_NAME}에서 글꼴 구매를 완료하세요.`,
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
