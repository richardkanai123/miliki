// Helper functions for checking permissions in the Miliki application

import { headers } from "next/headers";
import { auth } from "./auth";


export async function hasPermission({
  resource,
  action,
}: {
  resource:
    | "organization"
    | "property"
    | "unit"
    | "tenancy"
    | "invoice"
    | "payment"
    | "member"
    | "amenity"
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
        m.userId === session.user.id && m.organizationId === activeOrgId,
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
  // ===========================================
  // Organization
  // ===========================================

  /**
   * Check if user can create an organization
   */
  canCreateOrganization: async () =>
    await hasPermission({ resource: "organization", action: "create" }),

  /**
   * Check if user can manage organization (update, invite, remove)
   */
  canManageOrganization: async () =>
    await hasPermissions({
      organization: ["update", "invite", "remove"],
    }),

  // ===========================================
  // Properties
  // ===========================================

  /**
   * Check if user can manage properties (create, update, delete)
   */
  canManageProperties: async () =>
    await hasPermissions({
      property: ["create", "update", "delete"],
    }),

  /**
   * Check if user can create a property
   */
  canCreateProperty: async () =>
    await hasPermission({ resource: "property", action: "create" }),

  // ===========================================
  // Units
  // ===========================================

  /**
   * Check if user can manage units (create, update, delete, assign)
   */
  canManageUnits: async () =>
    await hasPermissions({
      unit: ["create", "update", "delete", "assign"],
    }),

  /**
   * Check if user can list units for house-hunting
   */
  canListUnits: async () =>
    await hasPermission({ resource: "unit", action: "list" }),

  /**
   * Check if user can unlist units from house-hunting
   */
  canUnlistUnits: async () =>
    await hasPermission({ resource: "unit", action: "unlist" }),

  /**
   * Check if user can assign units to tenants
   */
  canAssignUnits: async () =>
    await hasPermission({ resource: "unit", action: "assign" }),

  // ===========================================
  // Tenancies
  // ===========================================

  /**
   * Check if user can manage tenancies (create, update, delete)
   */
  canManageTenancies: async () =>
    await hasPermissions({
      tenancy: ["create", "update", "delete"],
    }),

  /**
   * Check if user can create a tenancy
   */
  canCreateTenancy: async () =>
    await hasPermission({ resource: "tenancy", action: "create" }),

  /**
   * Check if user can activate a pending tenancy
   */
  canActivateTenancy: async () =>
    await hasPermission({ resource: "tenancy", action: "activate" }),

  /**
   * Check if user can renew a tenancy
   */
  canRenewTenancy: async () =>
    await hasPermission({ resource: "tenancy", action: "renew" }),

  /**
   * Check if user can terminate a tenancy
   */
  canTerminateTenancy: async () =>
    await hasPermission({ resource: "tenancy", action: "terminate" }),

  // ===========================================
  // Invoices
  // ===========================================

  /**
   * Check if user can manage invoices (create, update, delete, send)
   */
  canManageInvoices: async () =>
    await hasPermissions({
      invoice: ["create", "update", "delete", "send"],
    }),

  /**
   * Check if user can create an invoice
   */
  canCreateInvoice: async () =>
    await hasPermission({ resource: "invoice", action: "create" }),

  /**
   * Check if user can send invoices to tenants
   */
  canSendInvoice: async () =>
    await hasPermission({ resource: "invoice", action: "send" }),

  /**
   * Check if user can mark an invoice as paid
   */
  canMarkInvoicePaid: async () =>
    await hasPermission({ resource: "invoice", action: "markPaid" }),

  /**
   * Check if user can void/cancel an invoice
   */
  canVoidInvoice: async () =>
    await hasPermission({ resource: "invoice", action: "void" }),

  // ===========================================
  // Payments
  // ===========================================

  /**
   * Check if user can make a payment (tenant action)
   */
  canMakePayment: async () =>
    await hasPermission({ resource: "payment", action: "create" }),

  /**
   * Check if user can view payments
   */
  canViewPayments: async () =>
    await hasPermission({ resource: "payment", action: "read" }),

  /**
   * Check if user can reconcile payments
   */
  canReconcilePayments: async () =>
    await hasPermission({ resource: "payment", action: "reconcile" }),

  /**
   * Check if user can process payment refunds
   */
  canRefundPayment: async () =>
    await hasPermission({ resource: "payment", action: "refund" }),

  // ===========================================
  // Members
  // ===========================================

  /**
   * Check if user can manage members (invite, remove, update, read)
   */
  canManageMembers: async () =>
    await hasPermissions({
      member: ["invite", "remove", "update", "read"],
    }),

  /**
   * Check if user can invite members to organization
   */
  canInviteMembers: async () =>
    await hasPermission({ resource: "member", action: "invite" }),

  /**
   * Check if user can remove members from organization
   */
  canRemoveMembers: async () =>
    await hasPermission({ resource: "member", action: "remove" }),

  // ===========================================
  // Amenities
  // ===========================================

  /**
   * Check if user can manage amenities (create, update, delete)
   */
  canManageAmenities: async () =>
    await hasPermissions({
      amenity: ["create", "update", "delete"],
    }),

  /**
   * Check if user can view amenities
   */
  canViewAmenities: async () =>
    await hasPermission({ resource: "amenity", action: "read" }),

  // ===========================================
  // Listings (Public)
  // ===========================================

  /**
   * Check if user can view public listings
   */
  canViewListings: async () =>
    await hasPermission({ resource: "listing", action: "view" }),

  /**
   * Check if user can search public listings
   */
  canSearchListings: async () =>
    await hasPermission({ resource: "listing", action: "search" }),

  // ===========================================
  // Organization
  // ===========================================

  /**
   * Check if user can delete an organization
   */
  // canDeleteOrganization: async () =>
  //   await hasPermission({ resource: "organization", action: "remove" }),
};
