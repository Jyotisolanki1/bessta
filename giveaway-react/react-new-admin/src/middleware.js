import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('adminToken')?.value;

  if (adminToken !== undefined) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  } else if (pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/']
};
