import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getUserSession } from "@/lib/getSession";
import db from "@/lib/prisma";
import { DAY_ORDER, getAllConnectionStatuses } from "@/utils/helper";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
const siteConfig = {
  name: "Meetassist",
  ogImage:
    "https://q212epyvwe.ufs.sh/f/W9qsvzaZwWtcDHS8PhSZhqGg0oZln3RVB2YUcPierfmHvwp4",
  url: "https://meetassist.cc",
  description:
    "AI-powered meeting assistant that joins your online meetings, takes flawless notes, keeps everything organized, and sets smart reminders so you never miss a beat.",

  keywords: [
    "AI meeting assistant",
    "automated meeting notes",
    "Zoom meeting recorder",
    "Google Meet transcription",
    "Microsoft Teams bot",
    "meeting note taker AI",
    "online meeting assistant",
    "automatic meeting minutes",
    "meeting scheduler bot",
    "virtual meeting assistant",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Meetassist - AI Meeting Assistant | Automated Notes & Scheduling",
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
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  category: "productivity",
  alternates: {
    canonical: siteConfig.url,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getUserSession();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const days = await db.availability.findMany({
    where: { userId: session?.user.id, isActive: true },
    select: {
      day: true,
    },
  });

  const DAY_INDEX_MAP = new Map(DAY_ORDER.map((day, index) => [day, index]));

  const sortedDays = days.sort((a, b) => {
    const aIndex = DAY_INDEX_MAP.get(a.day) ?? Infinity;
    const bIndex = DAY_INDEX_MAP.get(b.day) ?? Infinity;
    return aIndex - bIndex;
  });
  const image = session?.user?.image ?? null;
  const email = session?.user?.email ?? null;
  const name = session?.user?.name ?? null;

  const initials =
    session.user.name
      ?.split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";
  let isGoogleConnected = false;
  let isMicrosoftConnected = false;
  let isZoomConnected = false;
  try {
    const statuses = await getAllConnectionStatuses();
    isGoogleConnected = statuses.isGoogleConnected;
    isMicrosoftConnected = statuses.isMicrosoftConnected;
    isZoomConnected = statuses.isZoomConnected;
  } catch (error) {
    console.error("Failed to fetch connection statuses:", error);
  }
  return (
    <>
      <SidebarProvider>
        <DashboardSidebar
          name={name}
          email={email}
          image={image}
          days={sortedDays}
          isGoogleConnected={isGoogleConnected}
          isMicrosoftConnected={isMicrosoftConnected}
          isZoomConnected={isZoomConnected}
        />
        <SidebarInset>
          <header className="flex items-center justify-between px-4 pt-5 pb-2 md:hidden">
            <div className="flex items-center">
              <SidebarTrigger />
              <Image
                src="/meetassit.png"
                alt="meetassistLogo"
                className="object-cover"
                width={40}
                height={40}
                priority
              />
            </div>
            <Avatar>
              <AvatarImage
                src={image || "/noImage.png"}
                alt={name || "User avatar"}
                className="size-8"
              />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
          </header>
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors position="bottom-right" />
    </>
  );
}
