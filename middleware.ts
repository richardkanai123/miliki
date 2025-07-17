import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
 
const publicRoutes = ["/", "/sign-in", "/sign-up", "/forgot-password", "/reset-password"];
export async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    // check if current path is a public path
    const isPublicPath = publicRoutes.some((path) => request.nextUrl.pathname.startsWith(path));

    if (!session && !isPublicPath) {
        redirect('/signin');
    }

    return NextResponse.next();
}
 
export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard/:path*", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};