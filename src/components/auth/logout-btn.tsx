'use client'

import { signOut } from "@/lib/auth-client"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LogOutIcon } from "lucide-react"

const LogoutBtn = () => {
    const router = useRouter()
    const handleLogout = async () => {
        await signOut()
        toast.success("Logged out successfully")
        router.push("/login")
    }
    return (
        <Button type="button" variant="destructive" onClick={handleLogout} className="mx-auto p-3 flex items-center justify-center gap-2">
            <LogOutIcon className="size-4" />
            Logout
        </Button>
    )
}

export default LogoutBtn