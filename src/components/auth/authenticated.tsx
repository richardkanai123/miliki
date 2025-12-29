import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LogoutBtn from "./logout-btn"
import { Button } from "../ui/button"
import { HomeIcon, LayoutDashboard, UserIcon } from "lucide-react"
import { authCheck } from "@/lib/auth-check"
import AuthRequired from "./auth-required"

const Authenticated = async () => {
    const session = await authCheck()


    if (!session) {
        return (
            <AuthRequired />
        )
    }

    const role = session.user.role

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Authenticated </CardTitle>
                <CardDescription>
                    You are already signed in as {session.user?.name}
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center justify-center align-middle content-center gap-2">
                <Button type="button" asChild>
                    <Link className="flex items-center gap-2" href="/"> <HomeIcon className="size-4" /> Home</Link>
                </Button>
                {
                    role === 'admin' ? <Button className="bg-orange-500 text-white hover:bg-orange-600 hover:text-white border-none" type="button" asChild>
                        <Link href="/admin-panel" className=" flex items-center gap-2"> <LayoutDashboard className="size-4" /> Admin</Link>
                    </Button> : <Button className="bg-orange-500 text-white hover:bg-orange-600 hover:text-white border-none" type="button" asChild>
                        <Link href="/profile" className=" flex items-center gap-2"> <UserIcon className="size-4" /> Profile</Link>
                    </Button>
                }
                <LogoutBtn />
            </CardFooter>
        </Card>
    );
};

export default Authenticated;
