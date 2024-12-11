import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const companyToken = request.cookies.get('companyToken')?.value;
  const adminToken = request.cookies.get('adminToken')?.value;

  if (companyToken !== undefined) {
    if (pathname.includes('/admin') || pathname === '/signin') {
      return NextResponse.redirect(new URL('/company', request.url));
    }
  } else if (adminToken !== undefined) {
    if (pathname.includes('/company') || pathname === '/signin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  } else if (pathname !== '/signin') {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/company/:path*', '/signin']
};
