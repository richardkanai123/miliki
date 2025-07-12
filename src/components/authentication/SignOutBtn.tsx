"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { BetterAuthError } from "better-auth";

const SignOutBtn = () => {
    const { data, isPending, error } = useSession();

    if (isPending)
        return (
            <Button disabled>
                <Loader2 className="size-4 animate-spin" />
            </Button>
        );

    if (error || !data) {
        return null;
    }

    const handleSignOut = async () => {
        try {
            const { data, error } = await signOut();
            if (data?.success) {
                console.log("Sign out successful");
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
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Sign Out"}
        </Button>
    );
};

export default SignOutBtn;
