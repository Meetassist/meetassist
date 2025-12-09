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
import Image from "next/image";
import { redirect } from "next/navigation";

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

  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const sortedDays = days.sort((a, b) => {
    const aIndex = dayOrder.indexOf(a.day);
    const bIndex = dayOrder.indexOf(b.day);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
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

  return (
    <>
      <SidebarProvider>
        <DashboardSidebar
          name={name}
          email={email}
          image={image}
          days={sortedDays}
        />
        <SidebarInset>
          <header className="flex items-center justify-between px-6 pt-5 pb-2 md:hidden">
            <div className="flex items-center">
              <SidebarTrigger />
              <Image
                src="/meetassit.png"
                //  src="/meetassist-light.svg"
                alt="meetassistLogo"
                className="object-cover"
                width={40}
                height={40}
                priority
              />
            </div>
            <Avatar>
              <AvatarImage
                src={image || "/image.png"}
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
