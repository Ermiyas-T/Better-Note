import { NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  // const sessionCookie = await getSessionCookie(request);
  const session = await request.cookies.get("better-auth.session_token");

  console.log("session cookie:" + session);
  // console.log("session auth", auth);
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
