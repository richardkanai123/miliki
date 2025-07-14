"use client";
import { signUpSchema } from "@/lib/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/auth-client";
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
import { Card } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import GoogleAuthBtn from "./GoogleAuthBtn";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const SignUpForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const Router = useRouter();

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            username: "",
            // phone: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        try {
            const { email, password, name, username } = values;

            const { data, error } = await signUp.email({
                email,
                password,
                name,
                username,
                image: `https://avatar.iran.liara.run/username?username=${name}`,
                callbackURL: "/",
                // phone,
            });

            if (error) {
                form.setError("root", {
                    type: "manual",
                    message: error.message || "An error occurred during sign up.",
                });
                toast.error(error.message || "An error occurred during sign up.");
                return;
            }

            if (data) {
                const user = data.user.email;
                toast.success(
                    `Welcome ${user}, your account has been created successfully!`
                );
                form.reset();
                Router.replace("/");
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "An unexpected error occurred";
            form.setError("root", {
                type: "manual",
                message: errorMessage,
            });
            toast.error(errorMessage);
        }
    };

    return (
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
                <h1 className="text-2xl font-bold">Sign Up</h1>
                <p className="text-sm text-muted-foreground">
                    Create an account to get started.
                </p>

                <div className="w-full flex flex-col items-center justify-center space-y-2 mt-4">
                    <GoogleAuthBtn content="Sign up with Google" />
                    <div className="w-full flex items-center justify-center">
                        <p className="text-sm text-muted-foreground mt-2">
                            Already have an account?
                        </p>
                        <Button
                            asChild
                            variant="link"
                            size="sm"
                            className="mt-2">
                            <Link
                                prefetch={true}
                                className="dark:text-sky-200 underline"
                                href="/signin">
                                Sign In Now
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mx-auto  space-y-4 w-full flex-1 px-4 py-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg. John Doe"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Please enter your full (official) name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg. john_doe or johndoe1"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Username for your account. Must be 3-15 characters long and
                                    can only contain letters, numbers, and underscores.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="eg. john@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="eg. 0712345678" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

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
                                            className=""
                                            {...field}
                                        />
                                        <Button
                                            onClick={() => setShowPassword(!showPassword)}
                                            type="button"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 outline-0 ring-0">
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-shadow-muted" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-shadow-muted" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Password must be at least 8 characters and include uppercase,
                                    lowercase, number, and special character.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Confirm your password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>Please confirm your password.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {form.formState.errors.root && (
                        <div className="p-2 text-red-500 bg-amber-200 text-sm my-2 transition-all duration-300 ease-in-out">
                            {form.formState.errors.root.message}
                        </div>
                    )}

                    <Button
                        disabled={!form.formState.isValid}
                        type="submit"
                        className="w-full mt-4 py-6 disabled:cursor-not-allowed">
                        {form.formState.isSubmitting ? "Creating..." : "Create Account"}
                    </Button>
                </form>
            </Form>
        </Card>
    );
};

export default SignUpForm;
