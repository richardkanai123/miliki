import 'server-only'

import { headers } from "next/headers"
import { cache } from 'react'
import { auth } from "./auth"

export const authCheck = cache(async () => {
    // 'use cache: private'
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session
})


export const getUserRoleInOrganization = cache(async (slug: string) => {
    try {
        const session = await authCheck()
        const fullOrg = await auth.api.getFullOrganization({
            headers: await headers(),
            query: {
                organizationSlug: slug,
            },
        })

        const userRoleInOrg = fullOrg?.members.find((member) => member.userId === session?.user.id)?.role
        return userRoleInOrg
    } catch (error) {
        console.error("Error verifying organization access:", error)
        return null
    }
})
