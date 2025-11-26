"use client";
import * as React from "react";
import { Logo } from "@/components/Logo";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import CreateMeeting from "./CreateMeeting";

type DashboardSidebarProps = React.ComponentProps<typeof Sidebar> & {
  name: string | null;
  email: string | null;
  image: string | null;
  days: { day: string }[];
};

export function DashboardSidebar({
  name,
  image,
  email,
  days,
  ...props
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
        <CreateMeeting days={days} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser name={name} email={email} image={image} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
