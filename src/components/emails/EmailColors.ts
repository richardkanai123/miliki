export // Extract CSS custom properties to match your theme
const themeColors = {
    background: "hsla(210, 31%, 95%, 0.932)",
    foreground: "hsl(210 30% 10%)",
    card: "hsl(210 50% 98%)",
    cardForeground: "hsl(210 30% 20%)",
    primary: "hsl(240 80% 30%)",
    primaryForeground: "hsl(50 100% 95%)",
    secondary: "hsl(50 100% 80%)",
    secondaryForeground: "hsl(210 30% 10%)",
    muted: "hsl(240 20% 90%)",
    mutedForeground: "hsl(210 30% 20%)",
    accent: "hsl(50 100% 40%)",
    accentForeground: "hsl(210 30% 95%)",
    border: "hsl(210 30% 85%)",
    ring: "hsl(240 80% 60%)",
};
export const emailStyles = {
    body: {
        backgroundColor: themeColors.background,
        color: themeColors.foreground,
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: 0,
    },
    container: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: themeColors.card,
        borderRadius: "8px",
    },
    header: {
        textAlign: "center" as const,
        paddingBottom: "20px",
    },
    footer: {
        textAlign: "center" as const,
        paddingTop: "20px",
        fontSize: "12px",
        color: themeColors.mutedForeground,
    },
};