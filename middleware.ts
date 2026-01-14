import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// This secret must match the one used in lib/auth.ts and app/api/auth/login/route.ts
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-it';

export async function middleware(request: NextRequest) {
  // Check if the requested path starts with /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // If no token, redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify the token using jose (Edge-compatible)
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Check if the user has the 'admin' role
      if (payload.role !== 'admin') {
        // If not admin, redirect to home page or an unauthorized page
        return NextResponse.redirect(new URL('/', request.url));
      }

      // If token is valid and role is admin, allow the request
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware auth error:', error);
      // If token verification fails, redirect to login path
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Allow all other requests
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
     * - public files (images, etc)
     */
    '/dashboard/:path*',
  ],
};
