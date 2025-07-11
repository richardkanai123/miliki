import { prisma } from "@/lib/prisma";

export default async function Home() {

  const posts = await prisma.post.findMany()
  console.log(posts);
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <main className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Next.js App!</h1>
        <p className="text-lg mb-8">This is a simple example of a Next.js application.</p>

      </main>
    </div>
  );
}
