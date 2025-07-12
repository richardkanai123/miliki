'use client'
import React from 'react'
import { Button } from '../ui/button'
import { FcGoogle } from "react-icons/fc";
const GoogleAuthBtn = ({ content }: { content?: string }) => {
    // Default content if none is provided
    const defaultContent = "Continue with Google";
    return (
        <Button className="w-[90%] mx-auto p-6 text-lg font-bold" variant='default'>
            <FcGoogle className="mr-2 font-extrabold text-2xl " />
            {content || defaultContent}
        </Button>
    )
}

export default GoogleAuthBtn