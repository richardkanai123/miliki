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
import { UserPlusIcon } from "lucide-react"

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

const CreateAccountForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        toast("Account created successfully!", {
            description: (
                <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
                    <code>{JSON.stringify({ name: data.name, email: data.email, password: data.password }, null, 2)}</code>
                </pre>
            ),
            position: "bottom-right",
            classNames: {
                content: "flex flex-col gap-2",
            },
            style: {
                "--border-radius": "calc(var(--radius)  + 4px)",
            } as React.CSSProperties,
        })
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
                <form id="create-account-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button size="lg" type="submit" form="create-account-form">
                        <UserPlusIcon className="size-4" />
                        Create Account
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