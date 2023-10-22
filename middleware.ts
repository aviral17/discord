import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/api/uploadthing"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

// we are using publicRoutes with the link in middleware.ts of nextjs 13 because we want to make the /api/uploadthing route public, meaning that it doesn’t require authentication to access. We are also using a custom matcher array to apply authMiddleware to all routes except those that contain a dot (.), start with _next, or start with /api or /trpc. This way, we can protect our routes with Clerk authentication and customize which routes are public or ignored.
