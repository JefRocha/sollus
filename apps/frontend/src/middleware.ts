import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas que não requerem autenticação
const publicRoutes = ['/login'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('sollus_token');
    const { pathname } = request.nextUrl;

    // Se a rota é pública, permite acesso
    if (publicRoutes.includes(pathname)) {
        // Se já está autenticado e tenta acessar login, redireciona para dashboard
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Se não tem token e tenta acessar rota protegida, redireciona para login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Configurar quais rotas o middleware deve processar
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
