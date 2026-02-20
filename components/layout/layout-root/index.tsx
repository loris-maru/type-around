import { ClerkProvider } from "@clerk/nextjs";
import Navigation from "@/components/global/navigation";
import SmoothScrollProvider from "@/components/providers/smooth-scroll-provider";

export default function LayoutRoot({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      }
    >
      <html lang="en">
        <body
          className={`antialiased`}
          style={{
            fontFamily: "Whisper, Ortank, sans-serif",
          }}
        >
          <SmoothScrollProvider>
            <Navigation />
            <div className="relative z-20 min-h-screen w-screen">
              {children}
            </div>
          </SmoothScrollProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
