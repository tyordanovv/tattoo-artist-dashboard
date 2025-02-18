import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // Define public routes with proper pattern matching
  const isPublicRoute = (path: string) => {
    const publicPatterns = [
      '/login',
      '/register',
      '/questionnaire'  // This will match /questionnaire and any subpaths
    ]
    return publicPatterns.some(pattern => 
      path === pattern || path.startsWith(`${pattern}/`)
    )
  }

  const protectedRoutes = ['/', '/new-user', '/colaboration']

  // If user is logged in and tries to access public routes
  if (session && isPublicRoute(path)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If user is not logged in and tries to access protected routes
  if (!session && protectedRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}