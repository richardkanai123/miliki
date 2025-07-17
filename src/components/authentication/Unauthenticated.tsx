import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

// Unauthenticated Access Component
const UnAuthenticated = () => {
    return (
        <div className="w-full min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center space-y-4">
                    {/* Illustrative SVG */}
                    <div className="mx-auto">
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 120 120"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto">
                            {/* Background Circle */}
                            <circle
                                cx="60"
                                cy="60"
                                r="55"
                                fill="currentColor"
                                className="text-muted/20"
                            />

                            {/* Lock Body */}
                            <rect
                                x="35"
                                y="55"
                                width="50"
                                height="35"
                                rx="8"
                                fill="currentColor"
                                className="text-primary"
                            />

                            {/* Lock Shackle */}
                            <path
                                d="M45 55V45C45 36.7157 51.7157 30 60 30C68.2843 30 75 36.7157 75 45V55"
                                stroke="currentColor"
                                strokeWidth="6"
                                strokeLinecap="round"
                                fill="none"
                                className="text-primary"
                            />

                            {/* Keyhole */}
                            <circle
                                cx="60"
                                cy="67"
                                r="4"
                                fill="currentColor"
                                className="text-primary-foreground"
                            />
                            <rect
                                x="58"
                                y="67"
                                width="4"
                                height="8"
                                rx="2"
                                fill="currentColor"
                                className="text-primary-foreground"
                            />

                            {/* Warning Icon */}
                            <circle
                                cx="85"
                                cy="35"
                                r="12"
                                fill="currentColor"
                                className="text-destructive"
                            />
                            <path
                                d="M85 29V35M85 39V39.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                className="text-destructive-foreground"
                            />
                        </svg>
                    </div>

                    <div className="space-y-2">
                        <CardTitle className="text-xl flex items-center justify-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Access Restricted
                        </CardTitle>
                        <CardDescription className="text-center">
                            You need to sign in to access this page.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            asChild
                            className="flex-1">
                            <Link
                                href="/signin"
                                className="flex items-center justify-center gap-2">
                                <LogIn className="h-4 w-4" />
                                Sign In
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            asChild
                            className="flex-1">
                            <Link
                                href="/signup"
                                className="flex items-center justify-center gap-2">
                                Create Account
                            </Link>
                        </Button>
                    </div>
                </CardContent>

                <CardFooter className="text-center">
                    <p>  &copy; Miliki {new Date().getFullYear()}</p>

                </CardFooter>

            </Card>
        </div>
    );
};

export default UnAuthenticated;
