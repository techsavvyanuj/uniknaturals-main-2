import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Check if it's an admin path (except login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Check for admin auth token in cookies
    const adminAuth = request.cookies.get('adminAuth')?.value;

    // If no admin auth token, redirect to login
    if (!adminAuth) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Continue to the destination route
  return NextResponse.next();
}

// Configure matching paths
export const config = {
  matcher: ['/admin/:path*'],
}; 