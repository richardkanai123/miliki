import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const unprotectedRoutes = ["/login", "/create-account", "/forgot-password","/", "/404", "/not-found"];

export async function proxy(request: NextRequest) {
    console.log("proxy request", request.nextUrl.pathname);
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const currentPath = request.nextUrl.pathname;
    const currentPathIsProtected = !unprotectedRoutes.includes(currentPath);
    

   if(!session && currentPathIsProtected){
    return NextResponse.redirect(new URL("/login"));
   }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)","/dashboard/:path*"], 
};