import LoginForm from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const LoginPage = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center align-middle content-center m-auto">
            <LoginForm />
            <div className="w-full flex items-center justify-center gap-2 mt-4">
                <p className=" text-muted-foreground">Don't have an account?</p>
                <Link className="w-fit flex items-center underline gap-2 text-sky-500 hover:text-sky-600" href="/create-account">
                    Create Account
                </Link>
            </div>
        </div>
    )
}

export default LoginPage