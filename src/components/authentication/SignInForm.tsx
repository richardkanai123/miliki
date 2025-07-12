'use client'

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
import Image from "next/image"
import Link from "next/link"
import GoogleAuthBtn from "./GoogleAuthBtn"
import { signInSchema } from "@/lib/schemas/signInSchema"
import { Separator } from "../ui/separator"
const SignInForm = () => {

    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = (data: z.infer<typeof signInSchema>) => {
        console.log(data)
    }

    return (
        <div className="w-full h-full my-auto">

            <Card className="w-full sm:max-w-2xl md:max-w-4xl mx-auto flex flex-col md:flex-row items-center my-auto justify-center">
                <div className="flex-1 mx-auto flex flex-col align-middle items-center justify-center">
                    <div className="my-2 relative w-[100px] aspect-square ">
                        <Image src='/playstore.png' alt='Miliki' fill className="object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold">Sign In</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to your account to continue.
                    </p>

                    <Separator className=" my-2 w-full" />

                    <GoogleAuthBtn />



                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto  space-y-4 w-full flex-1 px-4 py-2">
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

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full  mt-4">
                            <Button type="submit" className="w-full py-6" >
                                Create Account
                            </Button>

                            <div className="w-full ">
                                <div className="w-full flex items-center justify-center">
                                    <p className="text-sm text-muted-foreground mt-2">
                                        New to Miliki?
                                    </p>
                                    <Button type="button" asChild variant="link" size="sm" className="mt-2">
                                        <Link prefetch={true} href='/signup'>Sign Up Now</Link>
                                    </Button>
                                </div>

                                <div className="w-full flex items-center justify-center">
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Forgot your password?
                                    </p>
                                    <Button type="button" asChild variant="link" size="sm" className="mt-2">
                                        <Link prefetch={true} href='/reset-password' className="text-blue-500 hover:underline">Reset it</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>

            </Card>


        </div>

    )
}

export default SignInForm