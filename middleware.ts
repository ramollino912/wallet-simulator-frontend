import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas (no requieren autenticación)
const publicPaths = ['/login', '/register', '/'];

// Rutas protegidas (requieren autenticación)
const protectedPaths = ['/dashboard', '/profile', '/transactions', '/services', '/transport'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Obtener token de las cookies (alternativa: se puede usar la cookie en lugar de localStorage)
  const token = request.cookies.get('auth-token')?.value;
  
  // Si la ruta es protegida y no hay token, redirigir a login
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Si hay token y el usuario intenta acceder a login/register, redirigir a dashboard
  const isAuthPath = publicPaths.some(path => pathname === path && path !== '/');
  
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configurar rutas donde se aplicará el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)',
  ],
};
