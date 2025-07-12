'use client'
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar'
import { useTheme } from 'next-themes'

const CustomAvatarImage = ({ src, alt }: { src: string, alt: string }) => {
    const { theme } = useTheme()

    // custom bg and color based on theme
    const bgColor = theme === 'dark' ? 'b726ff' : 'ff0000'
    const color = theme === 'dark' ? 'ffffff' : 'ff08da'

    const avatarFallbackStyle = {
        backgroundColor: `#${bgColor}`,
        color: `#${color}`
    }

    const avatarUrl = `${src}?background=${bgColor}&color=${color}`

    return (
        <Avatar className="rounded-lg">
            <AvatarImage
                src={avatarUrl}
                alt={`${alt} avatar`}
            />
            <AvatarFallback>{alt}</AvatarFallback>
        </Avatar>
    )
}

export default CustomAvatarImage