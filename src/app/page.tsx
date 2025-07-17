import LoggedUserDialog from "@/components/authentication/LoggedUserDialog";
import { checkAuth } from "@/lib/checkAuth";
import { redirect } from "next/navigation";
export default async function Home() {
  const session = await checkAuth()

  const username = session?.user.username as string
  const email = session?.user.email as string
  if (!session) {
    redirect('/signin');
  }

  return (
    <LoggedUserDialog CurrentUserEmail={email} CurrentUserName={username} />
  );

}
