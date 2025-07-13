'use client'
import { useSession } from '@/lib/auth-client'
import React, { useState } from 'react'
import ErrorAlert from '../ErrorAlert'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UpdateUserForm from './UpdateUserForm'
const UpdateProfile = () => {
    const { data, error, isPending, refetch } = useSession()
    const [isOpen, setIsOpen] = useState(false)

    if (isPending || !data) {
        return <div>Loading...</div>
    }

    if (error) {
        return (
            <div className="w-full">
                <ErrorAlert errorMessage={error.message} />
                <Button
                    className="mt-4"
                    onClick={() => refetch()}
                >
                    Retry
                </Button>
            </div>
        )
    }

    const { user } = data
    const { email, name, username, emailVerified } = user

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size='default'>
                    Update Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information.
                    </DialogDescription>
                </DialogHeader>
                <UpdateUserForm
                    email={email}
                    name={name}
                    username={username as string}
                    emailVerified={emailVerified}
                    setClose={(value) => setIsOpen(value)}
                />
            </DialogContent>
        </Dialog >
    )
}

export default UpdateProfile