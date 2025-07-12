'use client'
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
import Image from "next/image"
import Link from "next/link"
import GoogleAuthBtn from "./GoogleAuthBtn"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
const SignUpForm = () => {
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            phone: ""
        }
    })

    const onSubmit = (data: z.infer<typeof signUpSchema>) => {
        console.log(data)
    }

    return (
        <Card className="w-full sm:max-w-2xl md:max-w-4xl mx-auto flex flex-col md:flex-row items-center my-auto justify-center">
            <div className="flex-1 mx-auto flex flex-col align-middle items-center justify-center">
                <div className="my-2 relative w-[100px] aspect-square ">
                    <Image src='/playstore.png' alt='Miliki' fill className="object-contain" />
                </div>
                <h1 className="text-2xl font-bold">Sign Up</h1>
                <p className="text-sm text-muted-foreground">Create an account to get started.</p>

                <div className="w-full flex flex-col items-center justify-center space-y-2 mt-4">
                    <GoogleAuthBtn content="Sign up with Google" />
                    <div className="w-full flex items-center justify-center">
                        <p className="text-sm text-muted-foreground mt-2">Already have an account?</p>
                        <Button asChild variant="link" size="sm" className="mt-2">
                            <Link prefetch={true} className="dark:text-sky-200 underline" href='/signin'>Sign In Now</Link>
                        </Button>
                    </div>
                </div>

            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto  space-y-4 w-full flex-1 px-4 py-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="eg. John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="eg. 0712345678" {...field} />
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
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Confirm your password" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Please confirm your password.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full mt-4 py-6" >
                        Create Account
                    </Button>
                </form>
            </Form>
        </Card>
    )
}

export default SignUpForm