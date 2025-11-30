import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { authRoutes, protectedRoutes, publicRoutes } from "./routes";

export async function middleware(request: NextRequest) {
  const cookies = await getSessionCookie(request);
  const path = request.nextUrl.pathname;
  const isAuthPage = authRoutes.includes(path);
  const isPublicPage = publicRoutes.includes(path);
  const isProtectedPage = protectedRoutes.some((route) =>
    path.startsWith(route.replace("/:path*", ""))
  );

  console.log("session cookie:" + cookies);

  if (cookies && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!cookies) {
    if (isProtectedPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!isAuthPage && !isPublicPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/"],
};
