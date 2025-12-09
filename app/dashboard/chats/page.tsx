import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ArrowUp, SearchIcon } from "lucide-react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Meetassist - chat",
  description: "Chat with MeetAssist about your conversations",
};

import Image from "next/image";
export default function Page() {
  return (
    <section className="px-6 pb-4">
      <header className="hidden py-5 md:block">
        <InputGroup className="max-w-[500px] rounded-lg py-5">
          <InputGroupInput
            className="placeholder:text-base"
            placeholder="Ask or Search"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" className="font-inter">
            K
          </InputGroupAddon>
        </InputGroup>
      </header>
      <div className="border-border mt-3 flex items-center border-b pb-3 md:mt-6">
        <div>
          <h1 className="font-instrument text-2xl font-medium">MeetAssist</h1>
          <p className="font-instrument text-muted-foreground text-sm">
            This channel is just between meetassist and you. Ask anything about
            your conversations 💬
          </p>
        </div>
      </div>
      <div className="mt-8 flex items-start justify-between gap-8">
        <div className="font-instrument md:border-border w-full flex-1 pr-3 md:border-r">
          <h2 className="text-2xl font-medium">Meeting With Lucas</h2>
          <div className="mt-4 flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src="/image.png"
                alt="current user"
                className="size-8"
              />
            </Avatar>
            <p className="text-xl font-medium">Temidayo Akinbi</p>
            <p className="font-instrument text-muted-foreground text-sm">
              3 hours ago
            </p>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src="/meetassit.png"
                  alt="current user"
                  className="size-10 object-cover"
                />
              </Avatar>

              <p className="text-xl font-medium">Meetassist</p>
              <p className="font-instrument text-muted-foreground text-sm">
                3 hours ago
              </p>
            </div>
            <div className="px-10">
              <p className="font-instrument text-muted-foreground mt-4 max-w-full text-justify text-base font-medium md:max-w-[700px]">
                The meeting was productive and collaborative. You both clearly
                outlined objectives, shared perspectives on realistic timelines,
                and clarified responsibilities. There was good communication
                about technical constraints, the need for incremental progress,
                and the functional design. Setting clear action items and
                regular check-ins also helps ensure accountability and project
                momentum. Overall, it laid a solid foundation for successful
                teamwork and project delivery.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <Image
                  src="/thumbup.svg"
                  alt="positive"
                  className="cursor-pointer"
                  width={20}
                  height={20}
                />
                <Image
                  src="/thumbdown.svg"
                  className="cursor-pointer"
                  alt="negative"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="mt-[100px]">
            <InputGroup className="max-w-[600px] rounded-3xl px-4 py-9">
              <InputGroupInput
                placeholder="Ask Meetassist about your conversation"
                className="font-medium placeholder:text-base"
              />
              <InputGroupAddon align="inline-end">
                <Button
                  variant={"secondary"}
                  type="button"
                  className="cursor-pointer rounded-full p-3"
                >
                  <ArrowUp />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
        <div className="hidden w-[300px] shrink-0 md:block">
          <Button
            variant={"ghost"}
            className="text-primary mb-3 cursor-pointer text-sm font-medium"
          >
            Prev
          </Button>
          <div className="space-y-3">
            <p className="font-instrument text-base font-medium">
              Team Checking
              <span className="text-muted-foreground ml-1 text-sm">
                (2 days ago)
              </span>
            </p>
            <p className="font-instrument text-base font-medium">
              Team Meeting
              <span className="text-muted-foreground ml-1 text-sm">
                (Oct 1)
              </span>
            </p>
            <p className="font-instrument text-base font-medium">
              Team Checking
              <span className="text-muted-foreground ml-1 text-sm">
                (Oct 5)
              </span>
            </p>
            <p className="font-instrument text-base font-medium">
              Team Checking
              <span className="text-muted-foreground ml-1 text-sm">
                (2 days ago)
              </span>
            </p>
            <p className="font-instrument text-base font-medium">
              Team Checking
              <span className="text-muted-foreground ml-1 text-sm">
                (2 days ago)
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
