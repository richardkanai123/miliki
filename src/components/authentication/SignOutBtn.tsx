"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import { BetterAuthError } from "better-auth";
import { useRouter } from "next/navigation";

const SignOutBtn = () => {
    const { data, isPending, error } = useSession();
    const Router = useRouter()
    if (isPending)
        return (
            <Button disabled size='icon' variant="outline">
                <Loader2 className="size-4 animate-spin" />
            </Button >
        );

    if (error || !data) {
        return null;
    }

    const handleSignOut = async () => {
        try {
            const { data, error } = await signOut();
            if (data?.success) {
                toast.info('Bye, see you soon!');
                Router.replace("/signin");
            } else if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            toast.error(
                error instanceof Error || error instanceof BetterAuthError
                    ? error.message
                    : "An unexpected error occurred during sign out"
            );
        }
    };
    return (
        <Button
            variant="destructive"
            onClick={handleSignOut}>
            {isPending ? (<>
                <Loader2 className="size-4 animate-spin" />
                Checking...
            </>) : <>
                <LogOut className="h-4 w-4" />
                Sign Out
            </>}
        </Button>
    );
};

export default SignOutBtn;
