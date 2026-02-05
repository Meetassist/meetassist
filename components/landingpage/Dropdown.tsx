"use client";
import GoogleMeetSVG from "@/public/sync_1.svg";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Google, Microsoft, Slack, Zoom } from "@/utils/svgs";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const ProductContent = [
  {
    id: 1,
    header: "Calendar",
    content:
      "Automatically record and transcribe meetings scheduled in your calendar",
  },
  {
    id: 2,
    header: "Notes",
    content:
      "Automatically share meeting notes and summary in your note-taking app",
  },
  {
    id: 3,
    header: "Video Conferencing",
    content:
      "Record and transcribe meetings from Google Meet, Zoom & other apps",
  },
  {
    id: 4,
    header: "AI Proxy Assistant",
    content:
      "Get an AI Assistant that joins meetings for you when you are busy, it listens and brings you the meeting summary & feedback",
  },
];
export function NavDropMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="#product">Product</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Integration</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex justify-between gap-2 px-8 pt-14 pb-8 md:w-[800px]">
              <div className="flex flex-col gap-8">
                {ProductContent.map((content) => (
                  <div key={content.id}>
                    <h3 className="font-inter text-base font-medium text-[#0A0613]">
                      {content.header}
                    </h3>
                    <p className="font-inter mt-2 max-w-[400px] text-sm font-medium text-[#646566]">
                      {content.content}
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-4">
                  <div className="h-fit w-fit rounded-md border border-[#DFDFDF] p-4">
                    <Image src={GoogleMeetSVG} alt="Google meet logo" />
                  </div>
                  {[Microsoft, Google, Zoom, Slack].map((Icon, idx) => (
                    <div
                      key={idx}
                      className="h-fit w-fit rounded-md border border-[#DFDFDF] p-4"
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h2 className="font-inter text-base font-medium">
                    Connect Meetassist to your favorite Tools
                  </h2>
                  <Link
                    href={"/login"}
                    className="text-primary font-inter flex items-center gap-2 text-sm font-medium"
                  >
                    <span>Browse Integrations</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://t.me/meetassist"
            >
              Join Our Community
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="mailto:Meetassist.ai@gmail.com">Contact us</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
