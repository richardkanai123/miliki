'use client';
import { signUpSchema } from "@/lib/schemas/signUpSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import z from "zod"
import { Card } from "../ui/card"
import { use, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPassword } from "@/lib/auth-client";
import { SearchParams } from "next/dist/server/request/search-params";
import { toast } from "sonner";

const updatePasswordSchema = z.object({
    newPassword: signUpSchema.shape.password,
    confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],

    })


const UpdatePasswordForm = () => {
    const Router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const params = useSearchParams()
    const form = useForm({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        }
    })


    const onSubmit = async (values: z.infer<typeof updatePasswordSchema>) => {
        try {
            const { newPassword, confirmPassword } = values
            if (newPassword !== confirmPassword) {
                form.setError('confirmPassword', {
                    type: 'manual',
                    message: "Passwords don't match"
                })
            }

            const token = params.get("token");
            if (!token) {
                throw new Error("Token is required for password reset");
            }
            const { error } = await resetPassword({
                newPassword,
                token,
            });

            if (error) {
                throw new Error(error.message);
            }
            form.reset();
            toast.success("Password updated successfully!");
            Router.replace('/signin');

        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "An unexpected error occurred";
            toast.error(errorMessage);
            form.setError('root', {
                type: 'manual',
                message: errorMessage
            });

        }


    }

    const isStrongPassword = form.watch("newPassword").length >= 8 && form.watch("newPassword").match(/[a-z]/) && form.watch("newPassword").match(/[A-Z]/) && form.watch("newPassword").match(/[0-9]/) && form.watch("newPassword").match(/[^a-zA-Z0-9]/);

    const isPasswordsMatching = form.watch("newPassword") === form.watch("confirmPassword");

    return (
        <Card className="w-full mx-auto flex flex-col md:flex-row items-center my-auto justify-center transition-all duration-300 ease-in-out">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto  space-y-4 w-full flex-1 px-4 py-2">
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password  {
                                    isStrongPassword ? (
                                        <span className="text-green-500">Strong password</span>
                                    ) : (
                                        <span className="text-red-500">Weak password</span>
                                    )
                                }</FormLabel>
                                <FormControl>
                                    <div className="w-full relative">
                                        <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="" {...field} />
                                        <Button onClick={() => setShowPassword(!showPassword)} type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2 outline-0 ring-0">
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-shadow-muted" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-shadow-muted" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormDescription>

                                    Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
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
                                <FormLabel>Confirm Password
                                </FormLabel>
                                <FormControl>
                                    <div className="w-full relative">
                                        <Input type={showConfirmPassword ? "text" : "password"} placeholder="Enter your password" className="" {...field} />
                                        <Button onClick={() => setShowConfirmPassword(!showConfirmPassword)} type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2 outline-0 ring-0">
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-shadow-muted" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-shadow-muted" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Confirm your new password. It must match the new password.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {form.formState.errors.root && (
                        <div className="p-2 text-red-500 bg-amber-200 text-sm my-2 transition-all duration-300 ease-in-out">
                            {form.formState.errors.root.message
                            }
                        </div>
                    )}

                    <Button disabled={!form.formState.isValid} type="submit" className="w-full mt-4 py-6 disabled:cursor-not-allowed" >
                        {
                            form.formState.isSubmitting ? "Creating..." : "Create Account"
                        }
                    </Button>
                </form>
            </Form>
        </Card>
    )
}

export default UpdatePasswordForm