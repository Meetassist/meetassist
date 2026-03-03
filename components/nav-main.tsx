"use client";

import { SidebarGroup, SidebarMenu, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { name: "Home", href: "/dashboard", icon: "/home-icon.svg" },
  {
    name: "Meetassist Chats",
    href: "/dashboard/chats",
    icon: "/chat-icon.svg",
  },
  { name: "Sync", href: "/dashboard/sync", icon: "/sync-icon.svg" },
  {
    name: "Availability",
    href: "/dashboard/availability",
    icon: "/calendar-icon.svg",
  },
];

export function NavMain() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarGroup className="mt-5 px-3 md:mt-[30px]">
      <SidebarMenu className="space-y-2">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.name}
            href={{ pathname: link.href }}
            onClick={() => setOpenMobile(false)}
            className={cn(
              `flex items-center gap-2 rounded-lg px-4 py-1.5 text-base font-medium transition-all ease-in-out md:py-2.5 ${pathname === link.href ? "text-primary bg-[#F2F1FF]" : "hover:bg-muted-foreground/15"}`,
            )}
          >
            {link.icon && (
              <Image src={link.icon} alt="" width={20} height={20} />
            )}
            {link.name}
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
