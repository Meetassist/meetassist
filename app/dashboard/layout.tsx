import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getUserSession } from "@/lib/getSession";
import db from "@/lib/prisma";
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
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors position="bottom-right" />
    </>
  );
}
