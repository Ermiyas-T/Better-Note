import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { authRoutes, protectedRoutes } from "./routes";
export async function middleware(request: NextRequest) {
  // get better auth cookies check

  const cookies = await getSessionCookie(request);
  const isAuthPage = authRoutes.includes(request.nextUrl.pathname);
  const isProtectedPage = protectedRoutes.includes(request.nextUrl.pathname);

  console.log("session cookie:" + cookies);
  if (!cookies && !isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (cookies && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!cookies && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/"],
};
