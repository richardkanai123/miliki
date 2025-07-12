'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const SignInBtn = () => {
    return (
        <Button asChild variant="default" size='default'>
            <Link prefetch={true} href='/signin'>Sign In</Link>
        </Button>
    )
}

export default SignInBtn