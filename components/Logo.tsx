"use client";

import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <SidebarMenu className="py-5">
      <Link href="/dashboard">
        <SidebarMenuButton className="font-inter text-primary flex items-center -space-x-8 text-2xl font-medium">
          <Image src={"/meetassit.png"} alt="Logo" width={70} height={70} />
          Meetassist
        </SidebarMenuButton>
      </Link>
    </SidebarMenu>
  );
}
