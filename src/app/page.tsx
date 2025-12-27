import Authenticated from "@/components/auth/authenticated";
import { Suspense } from "react";

export default async function Page() {


    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="w-full min-h-screen flex flex-col items-center justify-center align-middle content-center m-auto">
                <Authenticated />
            </div>
        </Suspense>
    )
}