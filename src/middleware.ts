import { NextRequest, NextResponse } from "next/server"

const PUBLIC_PATHS = ["/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionId = request.cookies.get("session_id")?.value

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    if (sessionId) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  if (!sessionId) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
}
