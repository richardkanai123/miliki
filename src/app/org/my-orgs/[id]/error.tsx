'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DefaultErrorComponent from '@/components/error/default-error'

export default function OrgDetailError({
    error,
}: {
    error: Error & { digest?: string }
}) {
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState('')
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
        setErrorMessage(error.message)
    }, [error])

    const Reset = () => {
        router.back()
    }

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
            <DefaultErrorComponent message={errorMessage} reset={Reset} label="Go Back" />
        </div>
    )
}