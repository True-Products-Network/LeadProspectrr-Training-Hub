import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Minimal middleware - just pass through
  return
}

export const config = {
  matcher: [],
}
