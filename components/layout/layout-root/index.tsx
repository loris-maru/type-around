import { ClerkProvider } from "@clerk/nextjs";
import ReactDOM from "react-dom";
import ModalScrollLock from "@/components/global/modal-scroll-lock";
import Navigation from "@/components/global/navigation";
import SmoothScrollProvider from "@/components/providers/smooth-scroll-provider";
import { ErrorLogger } from "@/components/providers/error-logger";

export default function LayoutRoot({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // React 19's resource-hint APIs: Next.js hoists these into <head> and
  // de-duplicates automatically. Preload the two variable fonts used
  // above-the-fold so the browser can fetch them in parallel with the HTML /
  // CSS (critical for Korean users on higher-latency links where FOIT is most
  // visible). Preconnect warms TLS/DNS to Firebase Storage early.
  ReactDOM.preload("/fonts/OrtankHangeul_VAR.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  ReactDOM.preload("/fonts/WhisperMono-VAR.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://firebasestorage.googleapis.com", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://storage.googleapis.com", {
    crossOrigin: "anonymous",
  });

  return (
    <ClerkProvider
      publishableKey={
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      }
    >
      <html
        lang="en"
        suppressHydrationWarning
      >
        <body
          className={`antialiased`}
          style={{
            fontFamily: "Whisper, Ortank, sans-serif",
          }}
          suppressHydrationWarning
        >
          <ErrorLogger>
            <Navigation />
            <SmoothScrollProvider>
              <ModalScrollLock />
              <main
                id="main-content"
                className="relative z-20 min-h-screen w-full overflow-x-hidden"
              >
                {children}
              </main>
            </SmoothScrollProvider>
          </ErrorLogger>
        </body>
      </html>
    </ClerkProvider>
  );
}
