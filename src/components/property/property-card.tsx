'use client'
import type { Property } from '@/app/_generated/prisma/client/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '../ui/badge'
import { MapPinIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const PropertyCard = ({ property }: { property: Property }) => {
    const params = useParams()
    const slug = params?.slug as string
    const { name, address, city, images, isActive, id } = property
    return (
        <Link href={`/org/${slug}/properties/${id}`} className="block group">
            <Card className="overflow-hidden pt-0 hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-4/3 w-full overflow-hidden">
                    {/* <Image
                        src={images[0] || "/public/appstore.png]"}
                        alt={name}
                        placeholder="blur"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    /> */}
                    <div className="absolute top-3 left-3">
                        {isActive && <Badge variant="default" className="bg-primary/90 text-primary-foreground hover:bg-primary/80 font-medium shadow-sm backdrop-blur-sm">Active</Badge>}
                    </div>
                </div>

                <CardContent className="p-4">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">{name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                        <MapPinIcon className="w-3 h-3 shrink-0" />
                        <span className="line-clamp-1">{address}, {city}</span>
                    </div>

                </CardContent>
            </Card>
        </Link>
    )
}

export default PropertyCard
