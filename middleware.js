import { NextResponse } from "next/server";

import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "hello@34#");

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

    // const protectedRoutes = ["/myFormPage", "/admin", "/profile"];
   const { pathname } = request.nextUrl;
   console.log('my pathnam is >>',pathname)

  if (!token) {
    return NextResponse.redirect(new URL("/userLogin", request.url));
  }

  try {
    jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch (err) {
    console.log("JWT error:", err);
    return NextResponse.redirect(new URL("/userLogin", request.url));
  }
}

export const config = {
  matcher: ["/myFormPage/:path*", '/'],
};
