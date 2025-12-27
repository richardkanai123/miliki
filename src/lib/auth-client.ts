import { nextCookies } from "better-auth/next-js"
import { organizationClient,adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
export const authClient =  createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    plugins: [
    organizationClient(),
    adminClient(),
    nextCookies(),
    ]
})