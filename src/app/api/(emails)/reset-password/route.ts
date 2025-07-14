import ResetPassword from "@/components/emails/Reset_password";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import z from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
	try {
        const { email, username, resetUrl, token } = await request.json();
        
        if (!token) {
            return NextResponse.json("Missing token", { status: 400 });
        }

        if (!email || !username || !resetUrl) {
            return NextResponse.json("Missing required fields", { status: 400 });
        }

		const emailSchema = z.email();
		const parsedEmail = emailSchema.safeParse(email);
		if (!parsedEmail.success) {
			return NextResponse.json("Invalid email format", { status: 400 });
		}

		const { data, error } = await resend.emails.send({
			from: "Miliki <onboarding@resend.dev>",
			to: email,
			subject: "Reset Password for Miliki",
			react: ResetPassword({
				username: username as string,
				resetUrl: resetUrl as string,
			}),
		});

		if (error) {
			return NextResponse.json({ error }, { status: 500 });
		}

		return NextResponse.json(
			{ message: "Reset password email sent successfully", data },
			{ status: 200 }
		);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "An unexpected error occurred";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}