import UpdatePasswordForm from '@/components/authentication/UpdatePasswordForm'
import React from 'react'

const ResetPassword = () => {
    return (
        <div className="w-full mx-auto max-w-md p-4">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-sm text-muted-foreground">Enter your new password below.</p>

            <UpdatePasswordForm />
        </div>
    )
}

export default ResetPassword