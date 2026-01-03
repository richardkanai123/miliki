import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
    Hr,
} from '@react-email/components';

const InvitationEmail = (props: { invitedByUsername: string, invitedByEmail: string, teamName: string, inviteLink: string, role: string }) => {
    const { invitedByUsername, invitedByEmail, teamName, inviteLink, role } = props;

    return (
        <Html lang="en" dir="ltr">
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                primary: '#ea580c', // Orange-600 to match your app theme
                                foreground: '#09090b',
                                muted: '#71717a',
                                border: '#e4e4e7',
                            },
                        },
                    },
                }}
            >
                <Head />
                <Preview>Join {teamName} on Miliki</Preview>
                <Body className="bg-white font-sans py-10">
                    <Container className="bg-white border border-border rounded-lg mx-auto p-8 max-w-[480px]">
                        {/* Logo/Brand */}
                        <Section className="mb-8">
                            <Text className="text-2xl font-bold tracking-tight text-primary m-0">
                                Miliki
                            </Text>
                        </Section>

                        {/* Main Heading */}
                        <Heading className="text-foreground text-xl font-semibold m-0 mb-4">
                            Invitation to join {teamName}
                        </Heading>

                        {/* Content */}
                        <Text className="text-muted text-[14px] leading-6 m-0 mb-6">
                            Hello,
                        </Text>
                        <Text className="text-muted text-[14px] leading-6 m-0 mb-6">
                            <strong className="text-foreground">{invitedByUsername}</strong> ({invitedByEmail}) has invited you to join <strong className="text-foreground">{teamName}</strong> as a <strong className="text-foreground">{role}</strong>.
                        </Text>
                        <Text className="text-muted text-[14px] leading-6 m-0 mb-8">
                            Join your team to start managing properties, tenants, and collaborate effectively.
                        </Text>

                        {/* CTA Button */}
                        <Section className="mb-8">
                            <Button
                                href={inviteLink}
                                className="bg-primary text-white text-[14px] font-medium py-2.5 px-5 rounded-md no-underline block text-center w-full"
                            >
                                Accept Invitation
                            </Button>
                        </Section>

                        {/* Alternative Link */}
                        <Text className="text-muted text-[12px] m-0 mb-2">
                            Or copy and paste this URL into your browser:
                        </Text>
                        <Link
                            href={inviteLink}
                            className="text-primary text-[12px] underline break-all block mb-8"
                        >
                            {inviteLink}
                        </Link>

                        <Hr className="border-border my-6" />

                        {/* Footer */}
                        <Text className="text-muted text-[12px] leading-5 m-0">
                            This invitation was sent to you by {invitedByUsername}. If you were not expecting this invitation, you can safely ignore this email.
                        </Text>
                        <Text className="text-muted text-[12px] leading-5 m-0 mt-4">
                            © {new Date().getFullYear()} Miliki Properties Ltd. All rights reserved.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default InvitationEmail;
