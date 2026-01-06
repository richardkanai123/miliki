'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Loader2Icon, LockIcon, MailIcon } from "lucide-react"
import Link from "next/link"
import { signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

const LoginForm = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            await signIn.email({
                email: data.email,
                password: data.password,
            }, {
                onSuccess: () => {
                    toast.success("Login successful, welcome back!")
                    form.reset()
                    router.push("/")
                },
                onError: ({ error }) => {
                    toast.error("Unable to login", {
                        description: error.message,
                    })
                }
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
            toast.error("Unable to login", {
                description: errorMessage,
            })
        }
    }

    return (
        <Card className="w-full shadow-lg border-muted/20">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                <CardDescription>
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FieldGroup className="space-y-4">
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                    <FieldLabel htmlFor="login-form-email" className="text-sm font-medium">
                                        Email
                                    </FieldLabel>
                                    <div className="relative">
                                        <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            {...field}
                                            id="login-form-email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="m@example.com"
                                            autoComplete="email"
                                            className="pl-9 h-10"
                                        />
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-sm" />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="login-form-password" >
                                            Password
                                        </FieldLabel>
                                        <Link
                                            href="/reset-password"
                                            className="text-sm font-medium text-primary hover:underline"
                                            tabIndex={-1}
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <InputGroup className="w-full">
                                        <div className="relative w-full">
                                            <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                                            <InputGroupInput
                                                {...field}
                                                id="login-form-password"
                                                placeholder="Enter your password"
                                                aria-invalid={fieldState.invalid}
                                                type="password"
                                                autoComplete="current-password"
                                                className="pl-9 h-10"
                                            />
                                        </div>
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-sm" />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Button disabled={form.formState.isSubmitting} size="lg" className="w-full font-semibold" type="submit" form="login-form">
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                        </>
                    ) : (
                        "Sign In"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default LoginForm
