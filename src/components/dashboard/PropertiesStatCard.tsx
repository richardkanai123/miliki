'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Property } from '@/generated/prisma';
import { Building2 } from 'lucide-react'
import React, { use } from 'react'

interface PropertiesStatCardProps {
    propertiesPromise: Promise<{
        success: boolean
        message: string
        properties?: Property[] | undefined
    }>
}


const PropertiesStatCard = ({ propertiesPromise }: PropertiesStatCardProps) => {
    const { success, message, properties } = use(propertiesPromise)

    if (!success) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>
                        {message}
                    </CardTitle>
                </CardHeader>
            </Card>
        )
    }

    if (!properties) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>
                        {message}
                    </CardTitle>
                </CardHeader>
            </Card>
        )
    }


    const totalProperties = properties.length || 0;
    const newProperties = properties.filter(property => property.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length || 0;

    const stats = {
        totalProperties,
        newProperties,
    }



    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.totalProperties}</div>
                <p className="text-xs text-muted-foreground">
                    +2 new this month
                </p>
            </CardContent>
        </Card>
    )
}

export default PropertiesStatCard