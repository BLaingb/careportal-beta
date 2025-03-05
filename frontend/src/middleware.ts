import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getCurrentUser } from './lib/api/auth'
// Add paths that don't require authentication
const publicPaths = ['/login', '/signup', '/ingest']

const FRONTEND_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'
  : process.env.NEXT_PUBLIC_FRONTEND_URL ?? 'http://localhost:3000'


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Use request.cookies to get the auth token
  const authToken = request.cookies.get('auth_token')

  // Redirect to login if accessing protected route without being authenticated
  if (!isPublicPath && !authToken?.value) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Pass request.cookies to getCurrentUser
  const validSession = await getCurrentUser(request.cookies)
  if (!isPublicPath && !validSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isPublicPath && authToken?.value && validSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const response = NextResponse.next()

  // Enable CORS for the API domain
  const origin = request.headers.get('origin')
  if (origin) {
    // Only allow the frontend origin
    response.headers.set('Access-Control-Allow-Origin', FRONTEND_URL)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 