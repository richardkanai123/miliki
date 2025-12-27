import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, organization} from "better-auth/plugins"
import { prisma } from "./prisma";


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
plugins: [
    admin(),
    organization({
    creatorRole: "admin",
    cancelPendingInvitationsOnReInvite: true,
    })
    
],

session:{
    expiresIn: 60 * 60 * 24 * 7, // 7 days
}
});