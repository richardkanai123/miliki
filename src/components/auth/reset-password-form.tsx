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
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

const ResetPasswordForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        toast("Password reset email sent successfully!", {
            description: (
                <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
                    <code>{JSON.stringify(data, null, 2)}</code>
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
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                    Enter your email to reset your password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="reset-password-form-email">
                                        Email
                                    </FieldLabel>
                                    <FieldDescription>
                                        Enter your email address and we'll send you a reset link
                                    </FieldDescription>
                                    <Input
                                        {...field}
                                        id="reset-password-form-email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="example@example.com"
                                        autoComplete="email"
                                        type="email"
                                    />
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
                    <Button size="lg" type="submit" form="reset-password-form">
                        Reset Password
                    </Button>
                    <Button type="button" variant="outline" asChild>
                        <Link href="/login">
                            <ArrowLeftIcon className="size-4" />
                            Back to Login
                        </Link>
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}

export default ResetPasswordForm