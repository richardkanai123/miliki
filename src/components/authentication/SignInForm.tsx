"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import z from "zod";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import GoogleAuthBtn from "./GoogleAuthBtn";
import { signInSchema } from "@/lib/schemas/signInSchema";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";

const SignInForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const Router = useRouter();

    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            emailOrUsername: "",
            password: "",
        },
    });

    // Helper function to determine if input is email or username
    const isEmail = (input: string): boolean => {
        // Must contain @ and pass email validation
        return input.includes('@') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    };

    const onSubmit = async (values: z.infer<typeof signInSchema>) => {
        setIsLoading(true);
        const { emailOrUsername, password } = values;

        try {
            const { data, error } = isEmail(emailOrUsername)
                ? await signIn.email({ email: emailOrUsername, password })
                : await signIn.username({ username: emailOrUsername, password });

            if (error) {
                form.setError("root", {
                    type: "manual",
                    message: error.message || "Invalid credentials. Please try again.",
                });
                toast.error(error.message || "Invalid credentials. Please try again.");
                return;
            }

            if (data) {
                const user = data.user.name || data.user.email;
                toast.success(`Welcome back ${user}!`);
                form.reset();
                form.clearErrors();
                Router.replace("/"); // Use replace instead of push
            }
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "An error occurred during sign in.";

            form.setError("root", {
                type: "manual",
                message: errorMessage,
            });
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Get the current input value to show appropriate icon
    const currentInputValue = form.watch("emailOrUsername");
    const isValidInput = currentInputValue && (
        isEmail(currentInputValue) ||
        /^[a-zA-Z0-9_]{3,15}$/.test(currentInputValue)
    );

    const inputIcon = currentInputValue ? (
        isEmail(currentInputValue) ?
            <Mail className="h-4 w-4 text-muted-foreground" /> :
            <User className="h-4 w-4 text-muted-foreground" />
    ) : (
        <User className="h-4 w-4 text-muted-foreground" />
    );

    return (
        <div className="w-full h-full my-auto">
            <Card className="w-full sm:max-w-2xl md:max-w-4xl mx-auto flex flex-col md:flex-row items-center my-auto justify-center">
                <div className="flex-1 mx-auto flex flex-col align-middle items-center justify-center">
                    <div className="my-2 relative w-[100px] aspect-square ">
                        <Image
                            src="/playstore.png"
                            alt="Miliki"
                            fill
                            sizes="100px"
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-2xl font-bold">Sign In</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to your account to continue.
                    </p>
                    <Separator className=" my-2 w-full" />
                    <GoogleAuthBtn />
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mx-auto  space-y-4 w-full flex-1 px-4 py-2">

                        <FormField
                            control={form.control}
                            name="emailOrUsername"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email or Username</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="Enter your email or username"
                                                {...field}
                                                className="pl-10"
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                {inputIcon}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        You can sign in with either your email address or username
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="w-full relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                            <Button
                                                onClick={() => setShowPassword(!showPassword)}
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent">
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.formState.errors.root && (
                            <div className="p-3 text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-800 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{form.formState.errors.root.message}</span>
                            </div>
                        )}

                        <div className="w-full mt-6">
                            <Button
                                disabled={form.formState.isSubmitting || !form.formState.isValid}
                                type="submit"
                                className="w-full py-6">
                                {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
                            </Button>

                            <div className="w-full flex items-center justify-between mt-4">
                                <div className="flex items-center">
                                    <p className="text-sm text-muted-foreground">
                                        New to Miliki?
                                    </p>
                                    <Button
                                        type="button"
                                        asChild
                                        variant="link"
                                        size="sm">
                                        <Link
                                            prefetch={true}
                                            href="/signup"
                                            className="text-primary hover:underline">
                                            Sign Up Now
                                        </Link>
                                    </Button>
                                </div>

                                <Button
                                    type="button"
                                    asChild
                                    variant="link"
                                    size="sm">
                                    <Link
                                        prefetch={true}
                                        href="/reset-password"
                                        className="text-primary hover:underline">
                                        Reset Password
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default SignInForm;
