import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Session } from "next-auth";

type AuthenticatedRequest = NextRequest & {
  auth: Session | null;
};

export const proxy = auth((req: AuthenticatedRequest) => {
  const isLoggedIn = !!req.auth;

  const pathname = req.nextUrl.pathname;

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isAuthPage = isLoginPage || isRegisterPage;
  const isRootPage = pathname === "/";

  // Root → organization if logged in, otherwise login
  if (isRootPage) {
    return NextResponse.redirect(
      new URL(isLoggedIn ? "/organization" : "/login", req.url),
    );
  }

  // Logged-in users shouldn't access login/register
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/organization", req.url));
  }

  // Unauthenticated users can't access protected pages
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
