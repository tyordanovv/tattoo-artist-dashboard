import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    switch (token.role) {
        case "USER":
            if (!req.nextUrl.pathname.startsWith("/dashboard")) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
            break;
        case "ADMIN":
            if (
                !req.nextUrl.pathname.startsWith("/dashboard") &&
                !req.nextUrl.pathname.startsWith("/new-user")
            ) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
            break;
        }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
    ],
};
