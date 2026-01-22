import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/global/navigation";
import SmoothScrollProvider from "@/components/providers/smooth-scroll-provider";

export const metadata: Metadata = {
  title: "글자궤도 - The Future of Independent Korean Type Foundries",
  description:
    "글자궤도는 독립적인 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미랄 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타입 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한국 타임 팩토리의 미래를 이끌어갑니다. 우리는 한",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
        style={{ fontFamily: "Whisper, Ortank, sans-serif" }}
      >
        <SmoothScrollProvider>
          <Navigation />
          <div className="relative z-20 w-screen min-h-screen">{children}</div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
