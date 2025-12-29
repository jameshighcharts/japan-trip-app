import { NextRequest, NextResponse } from "next/server";

// Allow all routes for the Japan trip app (no auth required)
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
