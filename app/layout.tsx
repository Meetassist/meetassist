import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Instrument_Sans, Inter } from "next/font/google";
import localFont from "next/font/local";
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
  name: "Meetassist",
  ogImage:
    "https://q212epyvwe.ufs.sh/f/W9qsvzaZwWtcDHS8PhSZhqGg0oZln3RVB2YUcPierfmHvwp4",
  url: "https://meetassist.cc",
  description:
    "AI-powered meeting assistant that joins your online meetings, takes flawless notes, keeps everything organized, and sets smart reminders so you never miss a beat.",
  keywords: [
    "meetassist",
    "meetassist.cc",
    "AI meeting assistant",
    "automated meeting notes",
    "Zoom meeting recorder",
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
    default: "Meetassist | AI Meeting Assistant - Automated Notes & Scheduling",
    template: "%s | Meetassist",
  },

  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "Meetassist Team",
      url: siteConfig.url,
    },
  ],
  creator: "Meetassist",
  publisher: "Meetassist",
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
    title: "Meetassist - AI Meeting Assistant | Automated Notes & Scheduling",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Meetassist - AI-powered meeting assistant dashboard",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@meetassistAI",
    creator: "@meetassist",
    title: "Meetassist - AI Meeting Assistant | Automated Notes & Scheduling",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
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
        {children}
        <Toaster richColors position="bottom-right" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
