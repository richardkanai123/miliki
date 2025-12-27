'use client'
import { Button } from '@base-ui/react'
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner';
import { useTransition } from 'react';
import { Loader2Icon, TriangleAlertIcon } from 'lucide-react';
const SignInWithGoogleBtn = ({ label = 'Continue with Google' }: { label?: string }) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const { data, isPending: isSessionPending, isRefetching, error } = useSession()

    const signInWithGoogle = async () => {
        startTransition(async () => {
            await signIn.social({
                provider: 'google',
                newUserCallbackURL: '/',

            }, {
                onSuccess: () => {
                    toast.success('Signed in successfully')
                    router.push('/')
                },
                onError: ({ error }) => {
                    console.log(error)
                    toast.error(error.message || 'Something went wrong')
                }
            })
        })
    }

    if (isSessionPending || isRefetching) return (
        <Button className="w-full mx-auto max-w-md p-3 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-300 text-white" disabled>
            <Loader2Icon className="size-4 animate-spin" />
            Loading...
        </Button>
    )

    if (error) return (
        <Button className="w-full mx-auto max-w-md p-3 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-300 text-white" onClick={() => router.refresh()}>
            <TriangleAlertIcon className="size-4" />
            {error.message || 'Something went wrong'}. Reload the page and try again.
        </Button>
    )

    if (data) {
        router.push('/')
    }

    return (
        <Button className="w-full mx-auto max-w-md p-3 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-300 text-white" disabled={isPending} onClick={signInWithGoogle}>
            {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <FcGoogle className="size-4" />}
            {label}
        </Button>
    )
}

export default SignInWithGoogleBtn