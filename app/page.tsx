import ChatSection from "@/components/landingpage/ChatSection";
import FeaturesSection from "@/components/landingpage/FeaturesSection";
import Footer from "@/components/landingpage/Footer";
import HeroSection from "@/components/landingpage/HeroSection";
import { MobileNavbar, Navbar } from "@/components/landingpage/Navbar";
import SmartSection from "@/components/landingpage/SmartSection";
import TimeSection from "@/components/landingpage/TimeSection";
import LandingPageTracker from "@/components/mixpanel/LandingPageTracker";
import type { Metadata } from "next";
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

export default async function Home() {
  return (
    <main>
      <LandingPageTracker />
      <Navbar />
      <MobileNavbar />
      <HeroSection />
      <TimeSection />
      <ChatSection />
      <FeaturesSection />
      <SmartSection />
      <Footer />
    </main>
  );
}
