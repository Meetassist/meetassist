import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Instrument_Sans, Inter } from "next/font/google";
import localFont from "next/font/local";
import MixpanelProvider from "@/components/mixpanel/MixpanelProvider";
import "./globals.css";
const satoshiFont = localFont({
  src: "../public/fonts/Satoshi-Regular.otf",
  variable: "--font-satoshi",
  weight: "400",
  display: "swap",
});
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const siteConfig = {
  name: "meetassist",
  ogImage:
    "https://q212epyvwe.ufs.sh/f/W9qsvzaZwWtcSUGTtSxv7MRcGHuSX9yg61r0QbxDIZVATo4N",
  url: "https://meetassist.cc",
  description:
    "AI-powered meeting assistant that joins your online meetings, takes flawless notes, keeps everything organized, and sets smart reminders so you never miss a beat.",
  keywords: [
    "AI meeting assistant",
    "automated meeting notes",
    "Zoom meeting recorder",
    "meetassist",
    "meetassist.cc",
    "calendar booking",
    "Google Meet transcription",
    "Microsoft Teams bot",
    "meeting note taker AI",
    "online meeting assistant",
    "automatic meeting minutes",
    "meeting scheduler bot",
    "meeting scheduler",
    "virtual meeting assistant",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "meetassist - AI Meeting Assistant | Automated Notes & Scheduling",
    template: "%s | meetassist",
  },

  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "meetassist Team",
      url: siteConfig.url,
    },
  ],
  creator: "meetassist",
  publisher: "meetassist",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "meetassist - AI Meeting Assistant | Automated Notes & Scheduling",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 628,
        alt: "Meetassist - AI-powered meeting assistant dashboard",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@meetassistAI",
    creator: "@meetassistAI",
    title: "meetassist - AI Meeting Assistant | Automated Notes & Scheduling",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 628,
        alt: "meetassist",
        type: "image/png",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "productivity",
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${satoshiFont.variable} ${instrumentSans.variable} ${inter.variable} font-instrument font-medium antialiased`}
      >
        <MixpanelProvider>{children}</MixpanelProvider>
        <Toaster richColors position="bottom-right" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
