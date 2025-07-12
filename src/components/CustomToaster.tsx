'use client'
import { Toaster } from '@/components/ui/sonner'
import { useTheme } from 'next-themes'

const CustomToaster = () => {
    const { theme } = useTheme()

    return (
        <Toaster
            theme={theme as "light" | "dark" | "system"}
            position="top-right"
            richColors
            closeButton={false}
            expand={true}
        />
    )
}

export default CustomToaster