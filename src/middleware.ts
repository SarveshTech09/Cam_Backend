import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';

// Note: This is a simplified middleware example
// In production, you would verify Firebase ID tokens properly
export function middleware(request: NextRequest) {
  // Extract token from headers (in a real app, verify Firebase token)
  const token = request.headers.get('authorization')?.split(' ')[1];

  // For demo purposes, allowing all requests
  // In a real implementation, you would verify the Firebase token here
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