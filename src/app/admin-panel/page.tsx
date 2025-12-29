import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

const AdminPanel = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        return redirect("/login")
    }

    const role = session.user.role

    if (role !== "admin") {
        return redirect("/")
    }

    return (
        <div>
            <h1>Admin Panel</h1>
        </div>
    )
}

export default AdminPanel