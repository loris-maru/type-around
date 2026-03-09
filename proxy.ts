import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/account(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (!isPublicRoute(req) && isProtectedRoute(req)) {
      await auth.protect();
    }
  },
  {
    contentSecurityPolicy: {
      directives: {
        "connect-src": [
          "https://firebasestorage.googleapis.com",
          "https://*.googleapis.com",
          "https://connect.stripe.com",
          "https://api.stripe.com",
        ],
        "font-src": [
          "self",
          "data:",
          "https://storage.googleapis.com",
          "https://firebasestorage.googleapis.com",
          "https://*.googleapis.com",
        ],
        "img-src": [
          "self",
          "blob:",
          "https://img.clerk.com",
          "https://firebasestorage.googleapis.com",
          "https://storage.googleapis.com",
          "https://b.stripecdn.com",
          "https://*.stripecdn.com",
        ],
        "trusted-types": ["default"],
      },
    },
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
