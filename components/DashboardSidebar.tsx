"use client";
import * as React from "react";
import { Logo } from "@/components/Logo";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { RecordingButtonSidebar } from "@/components/ChatContent/RecordingButtonSidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import CreateMeeting from "./meetings/CreateMeeting";

type DashboardSidebarProps = React.ComponentProps<typeof Sidebar> & {
  name: string | null;
  email: string | null;
  image: string | null;
  days: { day: string }[];
  isGoogleConnected: boolean;
  isMicrosoftConnected: boolean;
  isZoomConnected: boolean;
};

export function DashboardSidebar({
  name,
  image,
  email,
  days,
  isGoogleConnected,
  isMicrosoftConnected,
  isZoomConnected,
  ...props
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
        <CreateMeeting
          days={days}
          isGoogleConnected={isGoogleConnected}
          isMicrosoftConnected={isMicrosoftConnected}
          isZoomConnected={isZoomConnected}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <RecordingButtonSidebar />
      </SidebarContent>
      <SidebarFooter>
        <NavUser name={name} email={email} image={image} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
