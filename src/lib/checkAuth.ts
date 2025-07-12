import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";
import { cache } from "react";

export const checkAuth = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return session;
});
