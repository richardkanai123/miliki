"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
const GoogleAuthBtn = ({ content }: { content?: string }) => {
    // Default content if none is provided
    const defaultContent = "Continue with Google";
    const Router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            await signIn.social({
                provider: "google",
            }, {
                onRequest: () => {
                    setLoading(true);
                },
                onSuccess: (ctx) => {
                    toast.success("Successfully signed in with Google!");
                    Router.push(ctx.data.url || "/");
                },
                onError: (error) => {
                    toast.error(
                        ` ${error instanceof Error ? error.message : "Unknown error Occurred when signing in with Google, please try again later."
                        } `
                    );
                },
            })
        } catch (error) {
            toast.error(
                `Error signing in with Google: ${error instanceof Error ? error.message : "Unknown error"
                } `
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            className="w-full md:w-[90%] mx-auto p-6 text-lg"
            variant="default"
            onClick={handleGoogleSignIn}
            disabled={loading}
        >
            {loading ? <Loader2 className="mr-2 size-6 text-lg " /> : (
                <>
                    <FcGoogle className="mr-2 size-6 text-lg " />
                    {content || defaultContent}
                </>
            )}
        </Button>
    );
};

export default GoogleAuthBtn;

