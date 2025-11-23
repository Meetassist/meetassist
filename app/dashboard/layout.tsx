import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getUserSession } from "@/lib/getSession";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getUserSession();
  const image = session?.user?.image ?? null;
  const email = session?.user?.email ?? null;
  const name = session?.user?.name ?? null;

  return (    <>
      <SidebarProvider>
        <DashboardSidebar name={name} email={email} image={image} />
        <SidebarInset>
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors position="bottom-right" />
    </>
  );
}
