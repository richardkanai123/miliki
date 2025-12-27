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
import { Link, LogInIcon } from "lucide-react"

const formSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

const LoginForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        toast("You submitted the following values:", {
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
                <CardTitle> Miliki</CardTitle>
                <CardDescription>
                    Login to your Miliki account to continue
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login-form-title">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="login-form-email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="example@example.com"
                                        autoComplete="off"
                                    />
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
                                    <FieldLabel htmlFor="login-form-password">
                                        Password
                                    </FieldLabel>
                                    <InputGroup className="w-full flex items-center justify-between">
                                        <InputGroupInput
                                            {...field}
                                            id="login-form-password"
                                            placeholder="Enter your password"
                                            aria-invalid={fieldState.invalid}
                                            type="password"
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
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <FieldGroup>
                    <Field orientation="horizontal">
                        <Button size="lg" type="submit" form="login-form">
                            <LogInIcon className="size-4" />
                            Login
                        </Button>
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Clear
                        </Button>
                    </Field>
                </FieldGroup>


            </CardFooter>
        </Card>
    )
}


export default LoginForm