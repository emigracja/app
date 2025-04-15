import { auth } from "./app/api/auth/auth";

export default auth; // Exporting auth directly integrates the authorized callback logic

// don't invoke Middleware on some paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (any public images folder)
     * - Also exclude auth routes themselves to avoid loops if needed, though authorized callback handles login page
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
