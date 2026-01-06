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
import { Loader2Icon } from "lucide-react"
import { signUp } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

const CreateAccountForm = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function SignUpWithEmailAndPassword(data: z.infer<typeof formSchema>) {
        try {
            await signUp.email({
                email: data.email,
                name: data.name,
                password: data.password,
            }, {
                onSuccess: () => {
                    toast.success("Account created successfully!")
                    form.reset()
                    router.push("/")
                },
                onError: (error) => {
                    toast.error(error.error.message, {
                        description: error.error.cause?.toString() || "An unknown error occurred"
                    })
                    form.setError("root.serverError", {
                        message: error.error.message
                    })
                }
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
            toast.error(errorMessage)
        }
    }

    return (
        <Card className="w-full shadow-lg border-muted/20">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                <CardDescription>
                    Enter your email below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="create-account-form" onSubmit={form.handleSubmit(SignUpWithEmailAndPassword)} className="space-y-4">
                    <FieldGroup className="space-y-4">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                    <FieldLabel htmlFor="create-account-form-name" className="text-sm font-medium">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="create-account-form-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="John Doe"
                                        autoComplete="name"
                                        className="h-10"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-sm" />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                    <FieldLabel htmlFor="create-account-form-email" className="text-sm font-medium">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="create-account-form-email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="m@example.com"
                                        autoComplete="email"
                                        className="h-10"
                                    />
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
                                    <FieldLabel htmlFor="create-account-form-password" >
                                        Password
                                    </FieldLabel>
                                    <InputGroup className="w-full">
                                        <InputGroupInput
                                            {...field}
                                            id="create-account-form-password"
                                            placeholder="Create a password"
                                            aria-invalid={fieldState.invalid}
                                            type="password"
                                            autoComplete="new-password"
                                            className="h-10"
                                        />
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-sm" />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                    <FieldLabel htmlFor="create-account-form-confirm-password">
                                        Confirm Password
                                    </FieldLabel>
                                    <InputGroup className="w-full">
                                        <InputGroupInput
                                            {...field}
                                            id="create-account-form-confirm-password"
                                            placeholder="Confirm your password"
                                            aria-invalid={fieldState.invalid}
                                            type="password"
                                            autoComplete="new-password"
                                            className="h-10"
                                        />
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-sm" />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    {form.formState.errors.root?.serverError && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                            <FieldError errors={[form.formState.errors.root.serverError]} className="text-sm text-destructive font-medium">
                                {form.formState.errors.root.serverError.message}
                            </FieldError>
                        </div>
                    )}
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button disabled={form.formState.isSubmitting} size="lg" type="submit" form="create-account-form" className="w-full">
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CreateAccountForm
