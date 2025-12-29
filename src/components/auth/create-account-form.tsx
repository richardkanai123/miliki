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
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Loader2Icon, UserPlusIcon } from "lucide-react"
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
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                    Create a new Miliki account to get started
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="create-account-form" onSubmit={form.handleSubmit(SignUpWithEmailAndPassword)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="create-account-form-name">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="create-account-form-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your name"
                                        autoComplete="name"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="create-account-form-email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="create-account-form-email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="example@example.com"
                                        autoComplete="email"
                                    />
                                    <FieldDescription>
                                        This email will be used to login to your account
                                        and receive important updates.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="create-account-form-password">
                                        Password
                                    </FieldLabel>
                                    <InputGroup className="w-full flex items-center justify-between">
                                        <InputGroupInput
                                            {...field}
                                            id="create-account-form-password"
                                            placeholder="Enter your password"
                                            aria-invalid={fieldState.invalid}
                                            type="password"
                                            autoComplete="new-password"
                                        />
                                    </InputGroup>
                                    <FieldDescription>
                                        Password must be at least 6 characters
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="create-account-form-confirm-password">
                                        Confirm Password
                                    </FieldLabel>
                                    <InputGroup className="w-full flex items-center justify-between">
                                        <InputGroupInput
                                            {...field}
                                            id="create-account-form-confirm-password"
                                            placeholder="Confirm your password"
                                            aria-invalid={fieldState.invalid}
                                            type="password"
                                            autoComplete="new-password"
                                        />
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    {form.formState.errors.root?.serverError && (
                        <FieldError errors={[form.formState.errors.root.serverError]}>
                            {form.formState.errors.root.serverError.message}
                        </FieldError>
                    )}
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button disabled={form.formState.isSubmitting} size="lg" type="submit" form="create-account-form">
                        {form.formState.isSubmitting ? <>
                            <Loader2Icon className="size-4 animate-spin" />
                            Creating account...
                        </> : <><UserPlusIcon className="size-4" />
                            Create Account</>}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Clear
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}

export default CreateAccountForm