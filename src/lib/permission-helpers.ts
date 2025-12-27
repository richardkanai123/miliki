// Helper functions for checking permissions in the Miliki application

import { auth } from "./auth";
import { headers } from "next/headers";

/**
 * Check if the current user has permission for a specific resource and action
 * 
 * @example
 * ```ts
 * const canCreateUnit = await hasPermission({
 *   resource: "unit",
 *   action: "create"
 * });
 * ```
 */
export async function hasPermission({
	resource,
	action,
}: {
	resource:
		| "organization"
		| "property"
		| "unit"
		| "lease"
		| "invoice"
		| "payment"
		| "member"
		| "listing";
	action: string;
}): Promise<boolean> {
	try {
		const result = await auth.api.hasPermission({
			headers: await headers(),
			body: {
				permissions: {
					[resource]: [action],
				},
			},
		});

		return result?.success ?? false;
	} catch (error) {
		console.error("Error checking permission:", error);
		return false;
	}
}

/**
 * Check if the current user has multiple permissions
 * 
 * @example
 * ```ts
 * const canManageUnits = await hasPermissions({
 *   unit: ["create", "update", "delete"]
 * });
 * ```
 */
export async function hasPermissions(
	permissions: Record<string, string[]>,
): Promise<boolean> {
	try {
		const result = await auth.api.hasPermission({
			headers: await headers(),
			body: {
				permissions,
			},
		});

		return result?.success ?? false;
	} catch (error) {
		console.error("Error checking permissions:", error);
		return false;
	}
}

/**
 * Get the current user's role in the active organization
 */
export async function getCurrentUserRole(): Promise<string | null> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return null;
		}

		// Check if session has active organization ID
		const activeOrgId = session.session?.activeOrganizationId;

		if (!activeOrgId) {
			return "user"; // User without organization membership
		}

		// Get the member record to find the role
		const membersResult = await auth.api.listMembers({
			headers: await headers(),
		});

		// Better Auth returns members in response.members array
		const member = membersResult?.members?.find(
			(m: { userId: string; organizationId: string }) =>
				m.userId === session.user.id &&
				m.organizationId === activeOrgId,
		);

		return member?.role ?? "user";
	} catch (error) {
		console.error("Error getting user role:", error);
		return null;
	}
}

/**
 * Common permission checks for common operations
 */
export const PermissionChecks = {
	/**
	 * Check if user can create an organization
	 */
	canCreateOrganization: async () =>
		await hasPermission({ resource: "organization", action: "create" }),

	/**
	 * Check if user can manage properties (create, update, delete)
	 */
	canManageProperties: async () =>
		await hasPermissions({
			property: ["create", "update", "delete"],
		}),

	/**
	 * Check if user can manage units (create, update, delete, assign)
	 */
	canManageUnits: async () =>
		await hasPermissions({
			unit: ["create", "update", "delete", "assign"],
		}),

	/**
	 * Check if user can manage leases (create, update, delete)
	 */
	canManageLeases: async () =>
		await hasPermissions({
			lease: ["create", "update", "delete"],
		}),

	/**
	 * Check if user can manage invoices (create, update, delete, send)
	 */
	canManageInvoices: async () =>
		await hasPermissions({
			invoice: ["create", "update", "delete", "send"],
		}),

	/**
	 * Check if user can manage members (invite, remove, update, read)
	 */
	canManageMembers: async () =>
		await hasPermissions({
			member: ["invite", "remove", "update", "read"],
		}),

	/**
	 * Check if user can invite members
	 */
	canInviteMembers: async () =>
		await hasPermission({ resource: "member", action: "invite" }),

	/**
	 * Check if user can view listings (public)
	 */
	canViewListings: async () =>
		await hasPermission({ resource: "listing", action: "view" }),
};
