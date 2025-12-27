import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LogoutBtn from "./logout-btn"
import { Button } from "../ui/button"
import { HomeIcon, LogInIcon } from "lucide-react"
import { authCheck } from "@/lib/auth-check"

const Authenticated = async () => {
    const session = await authCheck()


    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 h-screen">
                <h1 className="text-2xl font-bold">You are not authenticated</h1>
                <Link href="/login" className="flex items-center underline gap-2">Login <LogInIcon className="size-4" />
                </Link>
            </div >
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Authenticated</CardTitle>
                <CardDescription>
                    You are already signed in as {session.user?.name}
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center justify-center align-middle content-center gap-2">
                <Button type="button">
                    <Link className="flex items-center underline gap-2" href="/"> <HomeIcon className="size-4" /> Home</Link>
                </Button>
                <LogoutBtn />
            </CardFooter>
        </Card>
    )
}

export default Authenticated