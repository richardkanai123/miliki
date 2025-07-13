import { checkAuth } from "@/lib/checkAuth";
export default async function Home() {
  const session = await checkAuth()

  const username = session?.user.username
  return (
    <div>
      <h1>Welcome {username}!</h1>
    </div>

  );
}
