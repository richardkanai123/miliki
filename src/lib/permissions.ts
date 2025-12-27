// Custom permissions for the Miliki application
// Role hierarchy: admin > owner > manager > member > user

import { createAccessControl } from "better-auth/plugins/access";

// Define all resources and actions available in the application
const statement = {
	organization: ["create", "read", "update", "delete", "invite", "remove"],
	property: ["create", "read", "update", "delete"],
	unit: ["create", "read", "update", "delete", "assign"],
	lease: ["create", "read", "update", "delete", "renew", "terminate"],
	invoice: ["create", "read", "update", "delete", "send", "markPaid"],
	payment: ["create", "read", "update", "reconcile"],
	member: ["invite", "remove", "update", "read"],
	listing: ["view", "search"], // Public listings for potential tenants
} as const;

// Create the access control instance
export const ac = createAccessControl(statement);

// Define custom roles with their permissions

/**
 * Admin: Most superior role with full control over all resources
 * - Can create, update, and delete organization
 * - Full access to all resources within the organization
 * - Can manage all members (invite, remove, update roles)
 * - Highest level of permissions
 */
export const admin = ac.newRole({
	organization: ["create", "read", "update", "delete", "invite", "remove"],
	property: ["create", "read", "update", "delete"],
	unit: ["create", "read", "update", "delete", "assign"],
	lease: ["create", "read", "update", "delete", "renew", "terminate"],
	invoice: ["create", "read", "update", "delete", "send", "markPaid"],
	payment: ["create", "read", "update", "reconcile"],
	member: ["invite", "remove", "update", "read"],
	listing: ["view", "search"],
});

/**
 * Owner: Creates organization and has extensive control (under admin)
 * - Can create, update organization (but admin can delete)
 * - Full access to properties, units, leases, invoices, and payments
 * - Can manage members (invite, remove, update roles)
 */
export const owner = ac.newRole({
	organization: ["create", "read", "update", "invite", "remove"],
	property: ["create", "read", "update", "delete"],
	unit: ["create", "read", "update", "delete", "assign"],
	lease: ["create", "read", "update", "delete", "renew", "terminate"],
	invoice: ["create", "read", "update", "delete", "send", "markPaid"],
	payment: ["create", "read", "update", "reconcile"],
	member: ["invite", "remove", "update", "read"],
	listing: ["view", "search"],
});

/**
 * Manager: Manages units (under admin)
 * - Can create, update, and delete units
 * - Can assign units to members
 * - Can manage leases for their units
 * - Can create and manage invoices for their units
 * - Can view and reconcile payments
 * - Can invite members but with limited permissions
 */
export const manager = ac.newRole({
	organization: ["read"],
	property: ["read","create", "update"],
	unit: ["create", "read", "update", "delete", "assign"],
	lease: ["create", "read", "update", "renew", "terminate"],
	invoice: ["create", "read", "update", "send", "markPaid"],
	payment: ["read", "reconcile"],
	member: ["invite", "read"], // Can invite but not remove or update roles
	listing: ["view", "search"],
});

/**
 * Member: Tenant of a unit (under manager/admin)
 * - Can view their own unit and lease information
 * - Can view and pay their invoices
 * - Can view their payment history
 * - Can search public listings
 */
export const member = ac.newRole({
	organization: ["read"],
	property: ["read"],
	unit: ["read"],
	lease: ["read"],
	invoice: ["read"],
	payment: ["create", "read"], // Can make payments
	member: ["read"],
	listing: ["view", "search"],
});

/**
 * User: General user who can view listings as a potential tenant
 * - No organization membership
 * - Can only view and search public listings
 * - Cannot access any organization-specific resources
 */
export const user = ac.newRole({
	listing: ["view", "search"],
});

// Export roles object for use in auth configuration
// Order: admin (most superior) > owner > manager > member > user
export const roles = {
	admin,
	owner,
	manager,
	member,
	user,
};
