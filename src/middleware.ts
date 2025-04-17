import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verify } from "./app/utils/jwt";

export async function middleware(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const user = await verify(token);

    // No user found, redirect to login
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const response = NextResponse.next();
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|register|reset-password|forgot-password|logo|public|$).*)",
  ],
};
