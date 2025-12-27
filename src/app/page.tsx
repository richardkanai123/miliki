import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

export default async function Page() {
    'use cache'
    const users = await prisma.user.findMany();
    return (
        <div>
            <h1>Hello World</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <p>{users ? users.length : 0} users found</p>
            </Suspense>
        </div>
    )

}