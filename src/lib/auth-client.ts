import { createAuthClient } from "better-auth/react";
import { nextCookies } from "better-auth/next-js";
import {usernameClient } from "better-auth/client/plugins";
export const {
	resetPassword,
	signIn,
	signOut,
	signUp,
	changeEmail,
	changePassword,
	getSession,
	updateUser,
	useSession,
	verifyEmail,
	sendVerificationEmail,
} = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: process.env.BETTER_AUTH_URL,
	plugins: [
		usernameClient(),
		nextCookies()
	],
});
