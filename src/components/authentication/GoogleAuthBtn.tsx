'use client'
import React from 'react'
import { Button } from '../ui/button'
import { FcGoogle } from "react-icons/fc";
const GoogleAuthBtn = ({ content }: { content?: string }) => {
    // Default content if none is provided
    const defaultContent = "Continue with Google";
    return (
        <Button className="w-full md:w-[90%] mx-auto p-6 text-lg" variant='default'>
            <FcGoogle className="mr-2 size-6 font-bold text-xl " />
            {content || defaultContent}
        </Button>
    )
}

export default GoogleAuthBtn