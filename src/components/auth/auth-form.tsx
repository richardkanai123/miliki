'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "./login-form"
import CreateAccountForm from "./create-account-form"
import SignInWithGoogleBtn from "./google-auth-btn"

const AuthForm = ({ defaultTab }: { defaultTab: "login" | "create-account" }) => {
    return (
        <div className="flex min-h-[80vh] w-full items-center justify-center p-4">
            <div className="w-full max-w-[400px] space-y-6">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Authentication</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to your account or create a new one
                    </p>
                </div>

                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="create-account">Sign Up</TabsTrigger>
                    </TabsList>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <SignInWithGoogleBtn />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <TabsContent value="login" className="mt-0">
                            <LoginForm />
                        </TabsContent>
                        <TabsContent value="create-account" className="mt-0">
                            <CreateAccountForm />
                        </TabsContent>
                    </div>
                </Tabs>

                <p className="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </div>
    )
}

export default AuthForm
