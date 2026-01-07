import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"


export async function GET(
    request: NextRequest,
    props: { params: Promise<{ invitationId: string }> }
) {
   try {
     const { invitationId } =await props.params
    console.log(request.url,"invitationId", invitationId)
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`)
    }

    const res = await auth.api.acceptInvitation({
        headers: await headers(),
        body: {
            invitationId: invitationId,
        }
    })

    if (!res) {
        return NextResponse.json({ error: "Failed to accept invitation" }, { status: 500 })
    }

    const orgid = res.invitation.organizationId
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/org/${orgid}`)
   } catch (error) {
    console.error(error)
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
   }
}

