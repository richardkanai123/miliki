'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import z from "zod"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const ResetPasswordForm = () => {
    const resetPasswordSchema = z.object({
        email: z.email("Invalid email address")
    })


    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
        }
    })

    const onSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
        console.log(data)
    }

    return (
        <Card className="w-full h-full my-auto self-center max-w-md mx-auto flex flex-col items-center justify-center px-2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto  space-y-4 w-full flex-1 px-4 py-2">

                    <p>Enter your email address to reset your password</p>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="eg. john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full mt-4 py-6" >
                        Reset Password
                    </Button>
                </form>
            </Form >

            <div className="w-full flex items-center justify-center mt-4">
                <p className="text-sm text-muted-foreground mt-2">
                    Remembered your password?
                </p>
                <Button type="button" asChild variant="link" size="sm" className="mt-2">
                    <Link prefetch={true} href='/signin'>Sign In Now</Link>
                </Button>

            </div>
        </Card >
    )
}

export default ResetPasswordForm