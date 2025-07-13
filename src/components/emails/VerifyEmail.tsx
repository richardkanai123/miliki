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
import { themeColors } from "./EmailColors";

interface VerifyEmailProps {
    username?: string;
    verificationUrl?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const VerifyEmail = ({
    username,
    verificationUrl,
}: VerifyEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Verify your email address for Miliki</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Logo Section */}
                    <Section style={logoSection}>
                        <Img
                            src={`${baseUrl}/playstore.png`}
                            width="60"
                            height="60"
                            alt="Miliki"
                            style={logo}
                        />
                        <Heading style={h1}>Miliki</Heading>
                        <Text style={tagline}>Simamia. Rekodi. Pangisha.</Text>
                    </Section>

                    {/* Main Content */}
                    <Section style={content}>
                        <Heading style={h2}>Verify your email address</Heading>
                        <Text style={text}>Dear {username},</Text>
                        <Text style={text}>
                            Welcome to Miliki! To complete your account setup and start using
                            our platform, please verify your email address by clicking the
                            button below.
                        </Text>

                        {/* Verification Button */}
                        <Section style={buttonSection}>
                            <Button
                                style={button}
                                href={verificationUrl}>
                                Verify Email Address
                            </Button>
                        </Section>

                        <Text style={text}>
                            If the button above doesn't work, click the link below:
                        </Text>

                        <Section style={linkSection}>
                            <Button
                                style={secondaryButton}
                                href={verificationUrl}>
                                🔗 Open Verification Link
                            </Button>
                        </Section>

                        <Text style={helpText}>
                            You can also copy this link:
                            <Link href={verificationUrl} style={inlineLink}>
                                Verification Link
                            </Link>
                        </Text>

                        <Hr style={hr} />

                        <Text style={footer}>
                            This verification link will expire in 3 hours for security
                            reasons.
                        </Text>
                        <Text style={footer}>
                            If you didn't create an account with Miliki, you can safely ignore
                            this email.
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={footerSection}>
                        <Text style={footerText}>
                            © {new Date().getFullYear()} Miliki. All rights reserved.
                        </Text>
                        <Text style={footerText}>
                            Need help? Contact us at{" "}
                            <Link
                                href="mailto:support@miliki.com"
                                style={footerLink}>
                                support@miliki.com
                            </Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};


// Styles matching your theme
const main = {
    backgroundColor: themeColors.background,
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    padding: "0",
    margin: "0",
};

const container = {
    backgroundColor: themeColors.card,
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    maxWidth: "600px",
    border: `1px solid ${themeColors.border}`,
    borderRadius: "8px", // 0.5rem equivalent
};

const logoSection = {
    padding: "32px 20px 0",
    textAlign: "center" as const,
    backgroundColor: themeColors.card,
};

const logo = {
    margin: "0 auto",
    borderRadius: "8px",
    border: `2px solid ${themeColors.border}`,
};

const h1 = {
    color: themeColors.foreground,
    fontSize: "24px",
    fontWeight: "600",
    lineHeight: "1.25",
    margin: "16px 0 8px",
    textAlign: "center" as const,
};

const tagline = {
    color: themeColors.mutedForeground,
    fontSize: "14px",
    fontStyle: "italic",
    textAlign: "center" as const,
    margin: "0 0 16px",
};

const content = {
    padding: "20px 48px",
};

const h2 = {
    color: themeColors.foreground,
    fontSize: "20px",
    fontWeight: "600",
    lineHeight: "1.25",
    margin: "0 0 20px",
    textAlign: "center" as const,
};

const text = {
    color: themeColors.cardForeground,
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "16px 0",
};

const buttonSection = {
    textAlign: "center" as const,
    margin: "32px 0",
};

const button = {
    backgroundColor: themeColors.primary,
    borderRadius: "8px",
    color: themeColors.primaryForeground,
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 32px",
    border: `2px solid ${themeColors.primary}`,
    transition: "all 300ms ease-in-out",
};

const linkSection = {
    textAlign: "center" as const,
    margin: "20px 0",
};

const secondaryButton = {
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

const helpText = {
    color: themeColors.mutedForeground,
    fontSize: "12px",
    textAlign: "center" as const,
    margin: "16px 0",
};

const inlineLink = {
    color: themeColors.primary,
    textDecoration: "underline",
};

const hr = {
    borderColor: themeColors.border,
    margin: "32px 0",
    height: "1px",
    backgroundColor: themeColors.border,
};

const footer = {
    color: themeColors.mutedForeground,
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "8px 0",
    textAlign: "center" as const,
};

const footerSection = {
    padding: "0 48px 20px",
    backgroundColor: themeColors.muted,
    borderTop: `1px solid ${themeColors.border}`,
    borderRadius: "0 0 8px 8px",
    marginTop: "16px",
};

const footerText = {
    color: themeColors.mutedForeground,
    fontSize: "12px",
    lineHeight: "1.5",
    margin: "4px 0",
    textAlign: "center" as const,
};

const footerLink = {
    color: themeColors.accent,
    textDecoration: "underline",
    transition: "all 200ms",
};

export default VerifyEmail;
