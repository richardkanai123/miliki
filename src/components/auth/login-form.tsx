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
import { ArrowRightIcon, LoaderIcon, LogInIcon } from "lucide-react"
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
        <>
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
                            <Button disabled={form.formState.isSubmitting} className="font-semibold text-lg" type="submit" form="login-form">
                                {form.formState.isSubmitting ? <LoaderIcon className="size-4 animate-spin" /> : <LogInIcon className="size-4" />}
                                {form.formState.isSubmitting ? "Logging in..." : "Login"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Clear
                            </Button>
                        </Field>
                    </FieldGroup>


                </CardFooter>
            </Card>

            <Card className="w-full sm:max-w-md">
                <CardContent>

                    <div className="w-full flex items-center justify-center gap-2 mt-4">
                        <p className=" text-muted-foreground">Forgot your password?</p>
                        <Link className="w-fit flex items-center underline gap-2 text-sky-500 hover:text-sky-600" href="/reset-password">
                            Reset Password
                            <ArrowRightIcon className="size-4 animate-pulse hover:animate-none" />
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}


export default LoginForm