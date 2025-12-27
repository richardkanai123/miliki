'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "./login-form"
import CreateAccountForm from "./create-account-form"
import SignInWithGoogleBtn from "./google-auth-btn"
const AuthForm = ({ defaultTab }: { defaultTab: "login" | "create-account" }) => {


    return (
        <div className="w-full space-y-2  py-4 transition-all duration-300 ease-in">


            <Tabs defaultValue={defaultTab} className="w-full max-w-md mx-auto ">
                <TabsList className="w-full flex items-center justify-center " >
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="create-account">Create Account</TabsTrigger>
                </TabsList>
                <div className="w-full flex items-center justify-center gap-2">
                    <SignInWithGoogleBtn />
                </div>
                <TabsContent value="login">
                    <LoginForm />
                </TabsContent>
                <TabsContent value="create-account">
                    <CreateAccountForm />
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default AuthForm