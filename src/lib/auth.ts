import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
// import { customSession } from "better-auth/plugins";
import { prisma } from "./prisma";
export const auth = betterAuth({
    appName: 'Miliki',
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [process.env.BETTER_AUTH_URL || 'http://localhost:3000'],
    rateLimit: {
        enabled: true,
        max: 100,
        windowMs: 60 * 60 * 1000, // 1 hour
    },
    database: prismaAdapter(prisma, {
        provider: 'postgresql'
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 20,
        autoSignIn: true,
    },

    plugins: [
        nextCookies()
    ]
})