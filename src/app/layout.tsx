import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnalyticsGate } from "@/components/analytics-gate";
import { CookieConsent } from "@/components/cookie-consent";
import { ChatWidget } from "@/components/chat-widget";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "4-dagarsvecka med full lön | AI-konsult för svenska företag | 4days.ai",
    template: "%s | 4days.ai",
  },
  description:
    "4-dagarsvecka med full lön för kunskapsintensiva svenska företag. Från 5 till 4 – smartare, inte hårdare. 100% lön. 80% tid. 100% output.",
  keywords: [
    "4-dagarsvecka",
    "AI-konsult",
    "AI-automatisering",
    "100-80-100",
    "kortare arbetsvecka",
    "svenska företag",
  ],
  authors: [{ name: siteConfig.legalName }],
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: siteConfig.url,
    siteName: siteConfig.brand,
    title: "4-dagarsvecka med full lön | AI-konsult | 4days.ai",
    description:
      "Hjälper kunskapsintensiva svenska företag gå från 5 till 4 dagar med full lön – genom AI-automatisering.",
    images: [
      {
        url: "/og-image-v3.jpg",
        width: 1200,
        height: 630,
        alt: "4days.ai – En dag mer frihet. Med AI.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "4-dagarsvecka med full lön | AI-konsult | 4days.ai",
    description:
      "Från 5 till 4 – smartare, inte hårdare. 100% lön · 80% tid · 100% output.",
    images: ["/og-image-v3.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <CookieConsent />
        <ChatWidget />
        <AnalyticsGate />
      </body>
    </html>
  );
}
