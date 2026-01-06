import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, organization} from "better-auth/plugins"
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { ac, roles } from "./permissions";
import { resend } from "./resend";
import InvitationEmail from "./emails/invitation-email";
import { revalidatePath } from "next/cache";

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
        disableOrganizationDeletion:false,
    creatorRole: "owner", 
    cancelPendingInvitationsOnReInvite: true,
    invitationExpiresIn: 60 * 60 * 24 * 7, // 7 days
    ac, // Access control instance
    roles, 
    organizationHooks:{
        afterCreateOrganization:async () => {
            revalidatePath("/org/my-orgs")
        },
    },
    async sendInvitationEmail(data) {
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/invitation/accept-invitation/${data.id}`;
        resend.emails.send({
            from: "Miliki <onboarding@resend.dev>",
            to: data.email,
            subject: "You're invited to join Miliki organization.",
            react: InvitationEmail({
                invitedByUsername: data.inviter.user.name,
                invitedByEmail: data.inviter.user.email,
                teamName: data.organization.name,
                role:data.role,
                inviteLink,
            }),
        });
    },
    }),
    nextCookies()
],

session:{
expiresIn: 60 * 60 * 24 * 7, // 7 days
}
});


export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
export type Organization = typeof auth.$Infer.Organization