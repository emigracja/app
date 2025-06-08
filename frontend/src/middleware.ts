import { auth } from "./app/api/auth/auth";

export default auth; // Exporting auth directly integrates the authorized callback logic

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|manifest.json|sw.js|favicon.ico|icons/|images/).*)'],
};
