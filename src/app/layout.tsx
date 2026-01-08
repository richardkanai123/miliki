import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
const nunitoSans = Nunito_Sans({ variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Miliki",
  description: "Manage your property and tenants easily on a single platform, track payments, and more.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Miliki",
    description: "Manage your property and tenants easily on a single platform, track payments, and more.",
    url: "https://miliki.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miliki",
    description: "Manage your property and tenants easily on a single platform, track payments, and more.",
    images: ["https://miliki.com/og-image.png"],
  },
  keywords: ["miliki", "property", "tenants", "management", "real estate"],
  authors: [{ name: "Miliki", url: "https://miliki.com" }],
  creator: "Miliki",
  publisher: "Miliki",
  category: "property management software",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunitoSans.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="w-full min-h-screen max-hit m-auto ">
            {children}
          </div>
        </ThemeProvider>
        <Toaster theme="system" richColors />
      </body>
    </html>
  );
}
