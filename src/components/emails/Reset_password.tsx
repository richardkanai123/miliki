import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import { themeColors, emailStyles } from "./EmailColors";

interface ResetPasswordProps {
    username: string;
    resetUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const ResetPassword = ({ username, resetUrl }: ResetPasswordProps) => {
    return (
        <Html>
            <Head />
            <Preview>Reset your Miliki password</Preview>
            <Body style={emailStyles.body}>
                <Container style={emailStyles.container}>
                    {/* Logo Section */}
                    <Section style={emailStyles.header}>
                        <Img
                            src={`${baseUrl}/playstore.png`}
                            width="60"
                            height="60"
                            alt="Miliki"
                            style={logoStyle}
                        />
                        <Heading style={titleStyle}>Miliki</Heading>
                        <Text style={taglineStyle}>Simamia. Rekodi. Pangisha.</Text>
                    </Section>

                    {/* Main Content */}
                    <Section style={contentStyle}>
                        <Heading style={headingStyle}>Reset Your Password</Heading>
                        <Text style={textStyle}>Hi {username},</Text>
                        <Text style={textStyle}>
                            We received a request to reset your password for your Miliki
                            account. If you made this request, click the button below to reset
                            your password.
                        </Text>

                        {/* Reset Button */}
                        <Section style={buttonSectionStyle}>
                            <Button
                                style={primaryButtonStyle}
                                href={resetUrl}>
                                Reset Password
                            </Button>
                        </Section>

                        {/* Security Info */}
                        <Section style={infoBoxStyle}>
                            <Text style={infoTitleStyle}>🔒 Security Information</Text>
                            <Text style={infoTextStyle}>
                                • This link will expire in 1 hour for your security
                            </Text>
                            <Text style={infoTextStyle}>
                                • If you didn't request this, you can safely ignore this email
                            </Text>
                            <Text style={infoTextStyle}>
                                • Your password will remain unchanged until you create a new one
                            </Text>
                        </Section>

                        {/* Alternative Action */}
                        <Text style={textStyle}>
                            If the button above doesn't work, click the link below:
                        </Text>

                        <Section style={buttonSectionStyle}>
                            <Button
                                style={secondaryButtonStyle}
                                href={resetUrl}>
                                🔗 Open Reset Link
                            </Button>
                        </Section>

                        <Hr style={separatorStyle} />

                        {/* Help Section */}
                        <Section style={helpBoxStyle}>
                            <Text style={helpTitleStyle}>Need Help?</Text>
                            <Text style={helpTextStyle}>
                                If you're having trouble resetting your password or didn't
                                request this change, please contact our support team at{" "}
                                <Link
                                    href="mailto:support@miliki.com"
                                    style={linkStyle}>
                                    support@miliki.com
                                </Link>
                            </Text>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={emailStyles.footer}>
                        <Text style={footerTextStyle}>
                            © {new Date().getFullYear()} Miliki. All rights reserved.
                        </Text>
                        <Text style={footerTextStyle}>
                            This email was sent to {username} regarding password reset for
                            your Miliki account.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

// Custom styles extending the base emailStyles
const logoStyle = {
    margin: "0 auto",
    borderRadius: "8px",
    border: `2px solid ${themeColors.border}`,
};

const titleStyle = {
    color: themeColors.foreground,
    fontSize: "24px",
    fontWeight: "600",
    lineHeight: "1.25",
    margin: "16px 0 8px",
    textAlign: "center" as const,
};

const taglineStyle = {
    color: themeColors.mutedForeground,
    fontSize: "14px",
    fontStyle: "italic",
    textAlign: "center" as const,
    margin: "0 0 16px",
};

const contentStyle = {
    padding: "20px 0",
};

const headingStyle = {
    color: themeColors.foreground,
    fontSize: "20px",
    fontWeight: "600",
    lineHeight: "1.25",
    margin: "0 0 20px",
    textAlign: "center" as const,
};

const textStyle = {
    color: themeColors.cardForeground,
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "16px 0",
};

const buttonSectionStyle = {
    textAlign: "center" as const,
    margin: "32px 0",
};

const primaryButtonStyle = {
    backgroundColor: themeColors.primary,
    borderRadius: "8px",
    color: themeColors.primaryForeground,
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 40px",
    border: `2px solid ${themeColors.primary}`,
};

const secondaryButtonStyle = {
    backgroundColor: "transparent",
    border: `2px solid ${themeColors.primary}`,
    borderRadius: "8px",
    color: themeColors.primary,
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "10px 24px",
};

const infoBoxStyle = {
    backgroundColor: themeColors.muted,
    border: `1px solid ${themeColors.border}`,
    borderRadius: "8px",
    padding: "20px",
    margin: "24px 0",
};

const infoTitleStyle = {
    color: themeColors.foreground,
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 12px",
};

const infoTextStyle = {
    color: themeColors.mutedForeground,
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "4px 0",
};

const separatorStyle = {
    borderColor: themeColors.border,
    margin: "32px 0",
    height: "1px",
    backgroundColor: themeColors.border,
};

const helpBoxStyle = {
    backgroundColor: themeColors.muted,
    border: `1px solid ${themeColors.border}`,
    borderRadius: "8px",
    padding: "20px",
    margin: "20px 0",
};

const helpTitleStyle = {
    color: themeColors.foreground,
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 8px",
};

const helpTextStyle = {
    color: themeColors.mutedForeground,
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "0",
};

const linkStyle = {
    color: themeColors.primary,
    textDecoration: "underline",
    fontWeight: "500",
};

const footerTextStyle = {
    color: themeColors.mutedForeground,
    fontSize: "12px",
    lineHeight: "1.5",
    margin: "4px 0",
    textAlign: "center" as const,
};

export default ResetPassword;
