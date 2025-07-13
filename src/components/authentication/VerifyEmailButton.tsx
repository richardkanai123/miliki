"use client";
import { useSession } from "@/lib/auth-client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { sendVerificationEmail } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, MailWarningIcon, VerifiedIcon } from "lucide-react";

const VerifyEmailButton = () => {
    const { data, isPending } = useSession();
    const [isSending, setIsSending] = useState(false);

    if (isPending || !data) {
        return (
            <Button
                disabled
                className="animate-pulse"
                variant="outline">
                Loading...
            </Button>
        );
    }

    const currentUserEmail = data?.user.email;
    const handleVerifyEmail = async () => {
        try {
            setIsSending(true);
            await sendVerificationEmail(
                {
                    email: currentUserEmail,
                },
                {
                    onRequest: () => {
                        setIsSending(true);
                    },
                    onSuccess: () => {
                        toast.success("Verification email sent successfully!", {
                            duration: 5000,
                            description: "Please check your inbox.",
                        });
                    },
                    onError: ({ error }) => {
                        const errorMessage =
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred";
                        throw new Error(errorMessage);
                    },
                }
            );
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "An unexpected error occurred";
            toast.error(errorMessage, {
                duration: 5000,
                description: "Please try again later.",
            });
        } finally {
            setIsSending(false);
        }
    };

    if (data.user.emailVerified) {
        return (
            <Button
                disabled
                className=" text-sm"
                variant="outline">
                <VerifiedIcon className="size-3 mr-2" />
                Email Verified
            </Button>
        );
    }

    return (
        <Button
            onClick={handleVerifyEmail}
            className=" text-sm"
            disabled={isSending}
            variant="outline">

            {isSending ? <>
                <Loader2 className="animate-spin size-3 mr-2" />
                Sending...
            </> : <>
                <MailWarningIcon className="size-3 mr-2" />
                <span className="text-sm">Verify Email</span>
            </>}
        </Button>
    );
};

export default VerifyEmailButton;
