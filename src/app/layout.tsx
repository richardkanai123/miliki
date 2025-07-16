import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import CustomToaster from "@/components/CustomToaster";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  display: "auto"
});

export const metadata: Metadata = {
  title: "Miliki",
  description: "A private tool for Kenyan landlords to manage, record, and optimize rental property operations",
  keywords: ["Miliki", "Landlords", "Rental Management", "Property Management", "Kenya", "Landlord Tools", "Rental Operations", "Tenant Management", "Financial Tracking", "Maintenance Management", "Rental Income", "Expense Tracking", "Property Optimization", "Landlord Software", "Rental Analytics", "Tenant Communication", "Property Listings", "Rental Agreements", "Rent Collection", "Property Maintenance", "Dashboard", "Landlord Dashboard", "Rental Insights", "Property Management Software", "Kenyan Landlords"],

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  openGraph: {
    title: "Miliki",
    description: "A private tool for Kenyan landlords to manage, record, and optimize rental property operations",
    url: "https://miliki.vercel.app",
    siteName: "Miliki",
    images: [
      {
        url: "https://miliki.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Miliki - Landlord Management Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miliki",
    description: "A private tool for Kenyan landlords to manage, record, and optimize rental property operations",
    images: ["https://miliki.vercel.app/og-image.png"],
    creator: "@richardkanai123",

  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning >
        <head>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />

        </head>

        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="w-full min-h-auto  max-h-fit pt-4 px-2 mx-auto">{children}</main>
            <CustomToaster />
          </ThemeProvider>
        </body>
      </html >
    </>

  );
}
