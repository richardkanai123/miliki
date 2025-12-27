// Role type definitions and helper functions for Miliki

import type { Role } from "better-auth/plugins/access";

/**
 * Available roles in the Miliki application
 */
export type MilikiRole = "owner" | "admin" | "manager" | "member" | "user";

/**
 * Role hierarchy for permission checking
 * Higher number = more permissions
 */
export const ROLE_HIERARCHY: Record<MilikiRole, number> = {
	admin: 5,
	owner: 4,
	manager: 3,
	member: 2,
	user: 1,
};

/**
 * Check if a role has sufficient permissions compared to another role
 */
export function hasRolePermission(
	userRole: MilikiRole,
	requiredRole: MilikiRole,
): boolean {
	return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: MilikiRole): string {
	const displayNames: Record<MilikiRole, string> = {
		admin: "Admin",
		owner: "Owner",
		manager: "Manager",
		member: "Member",
		user: "User",
	};
	return displayNames[role];
}

/**
 * Get role description
 */
export function getRoleDescription(role: MilikiRole): string {
	const descriptions: Record<MilikiRole, string> = {
		admin: " Has full control over all resources.",
		owner: "Creates and owns the organization. Can manage properties, units, leases, and members.",
		manager: "Manages units and leases. Can assign units to tenants and manage invoices.",
		member: "Tenant of a unit. Can view their lease, invoices, and make payments.",
		user: "General user. Can view public listings as a potential tenant.",
	};
	return descriptions[role];
}

/**
 * Check if a role can manage another role
 */
export function canManageRole(
	managerRole: MilikiRole,
	targetRole: MilikiRole,
): boolean {
	// Admins can manage everyone (most superior role)
	if (managerRole === "admin") return true;

	// Owners can manage manager, member, and user
	if (managerRole === "owner") {
		return ["manager", "member", "user"].includes(targetRole);
	}

	// Managers can only manage members
	if (managerRole === "manager") {
		return targetRole === "member";
	}

	// Members and users cannot manage anyone
	return false;
}

