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
    creatorRole: "owner", // Creator becomes owner (admin is most superior role)
    cancelPendingInvitationsOnReInvite: true,
    ac, // Access control instance
    roles, // Custom roles (admin > owner > manager > member > user)
    }),
    nextCookies()
],

session:{
    expiresIn: 60 * 60 * 24 * 7, // 7 days
}
});