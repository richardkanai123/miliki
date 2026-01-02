import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, organization} from "better-auth/plugins"
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { ac, roles } from "./permissions";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
    provider: "postgresql",
}),

rateLimit:{enabled: true, trustProxy: true, max: 100, window: 60000},

appName: "Miliki",
emailAndPassword:{
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
    maxPasswordLength:20,
    revokeSessionsOnPasswordReset: true
    },
socialProviders:{
    google: {
        enabled: true,
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        mapProfileToUser(profile) {
            return {
                email: profile.email,
                name: profile.name,
                image: profile.picture,
            }
        },
    },
    
    },

    account: {
        accountLinking: {
            enabled: true,
            allowDifferentEmails: false,
            trustedProviders: ['google'],
        }
    },
plugins: [
    admin(),
    organization({
        disableOrganizationDeletion:false,
    creatorRole: "owner", 
    cancelPendingInvitationsOnReInvite: true,
    ac, // Access control instance
    roles, 
}),
nextCookies()
],

session:{
    expiresIn: 60 * 60 * 24 * 7, // 7 days
}
});


export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
export type Organization = typeof auth.$Infer.Organization