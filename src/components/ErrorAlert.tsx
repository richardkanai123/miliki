'use client'

import React from 'react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { AlertCircleIcon, ArrowLeft, HomeIcon, RefreshCwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'

const ErrorAlert = ({ errorMessage }: { errorMessage: string }) => {
    const Router = useRouter()
    const pathName = usePathname()
    const isHomePage = pathName === '/'

    return (
        <Alert variant="destructive" className="w-full md:max-w-lg mx-auto my-auto">
            <AlertCircleIcon />
            <AlertTitle>An error occurred</AlertTitle>
            <AlertDescription>
                <p className="text-sm font-medium">{errorMessage}</p>

                <div className="w-full flex flex-wrap gap-2 align-middle items-center mt-4 justify-center">
                    <Button variant="default" onClick={() => Router.refresh()}>
                        <RefreshCwIcon className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                    {isHomePage ? (
                        <Button variant="secondary" onClick={() => Router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                    ) : (
                        <Button variant="secondary" onClick={() => Router.push('/')}>
                            <HomeIcon className="mr-2 h-4 w-4" />
                            Go Home
                        </Button>
                    )}


                </div>
            </AlertDescription>
        </Alert >
    )
}

export default ErrorAlert