import { nextCookies } from "better-auth/next-js"
import { organizationClient,adminClient, inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import type { auth } from "./auth"
export const { accountInfo, signIn, signUp, signOut, useSession, resetPassword, admin, changeEmail, changePassword, deleteUser, organization, verifyEmail, updateUser, getSession, sendVerificationEmail } = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    plugins: [
    organizationClient(),
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    nextCookies(),
    ]
})