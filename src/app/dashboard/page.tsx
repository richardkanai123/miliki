import UnAuthenticated from "@/components/authentication/Unauthenticated";
import { checkAuth } from "@/lib/checkAuth";

export default async function MainDashboard() {
  const session = await checkAuth()

  if (!session) {
    return (
      <UnAuthenticated />
    )
  }
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}
