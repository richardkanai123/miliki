import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
// import { customSession } from "better-auth/plugins";
import { prisma } from "./prisma";
export const auth = betterAuth({
	appName: "Miliki",
	secret: process.env.BETTER_AUTH_SECRET,
	trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
	rateLimit: {
		enabled: true,
		max: 100,
		windowMs: 60 * 60 * 1000, // 1 hour
	},
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		maxPasswordLength: 20,
		autoSignIn: true,
	},
	emailVerification: {
		expiresIn: 60 * 60 * 3, // 3 hours
		sendOnSignUp: true,
		autoSignInAfterVerification: true,

		sendVerificationEmail: async ({ user, url }) => {
			const { email, name } = user;
			const res = await fetch(
				`${process.env.BETTER_AUTH_URL}/api/verify-user`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email,
						username: name,
						verificationUrl: url,
					
					}),
				}
			);

			return res.json();

		}
	},
	socialProviders: {
		google: {
            enabled: true,
            overrideUserInfoOnSignIn: true,
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			mapProfileToUser: ({
				email,
				email_verified,
				given_name,
				family_name,
                picture,
                
			}) => ({
				name: given_name,
				email,
				emailVerified: email_verified,
				image: picture,
				username: given_name?.toLowerCase() + family_name?.toLowerCase(),
            }),
		},
	},

	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["google"],
			updateUserInfoOnLink: true,
		},
    },
    
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days

        }
    },
	plugins: [
		username({
			minUsernameLength: 3,
			maxUsernameLength: 15,
		}),
		nextCookies(),
	],
});
