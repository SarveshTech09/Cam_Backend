import { NextRequest, NextResponse } from 'next/server';

// Note: This is a simplified middleware example
// For Firebase authentication, we'll handle verification in each API route
export function middleware(request: NextRequest) {
  // For this implementation, we'll handle authentication in individual API routes
  // rather than in middleware to avoid Firebase Admin SDK complexity
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};