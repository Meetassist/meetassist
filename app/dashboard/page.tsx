import Header from "@/components/Header";
import CreateMeeting from "@/components/meetings/CreateMeetingButtonMobile";
import { Meetings } from "@/components/meetings/Meetings";
import { UpcomingMeeting } from "@/components/meetings/UpcomingEvent";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { getUserSession } from "@/lib/getSession";
import db from "@/lib/prisma";
import mobileHero from "@/public/hero-mb.jpg";
import Image from "next/image";
export default async function Page() {
  const session = await getUserSession();
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
  return (
    <>
      <Header />
      <section className="mt-1 px-6">
        <div>
          <div className="relative hidden min-h-[210px] overflow-hidden rounded-2xl md:block">
            <Image
              src="/home-hero.svg"
              alt="hero"
              fill
              priority
              className="object-cover"
            />

            <div className="relative z-10 p-8">
              <h1 className="font-inter mb-2 text-[22px] font-semibold text-white">
                Record a live Meeting
              </h1>
              <p className="text-muted-foreground font-inter text-sm tracking-tighter">
                Works with Zoom, Google Meet, or Microsoft Teams
              </p>
              <div className="mt-10">
                <InputGroup className="w-[500px] rounded-3xl py-6">
                  <InputGroupInput
                    placeholder="Paste meeting URL to add Meetassist"
                    className="rounded-2xl text-white"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      variant="secondary"
                      className="font-inter cursor-pointer rounded-3xl px-3 py-5 text-sm font-normal"
                    >
                      Record meeting
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>
          <div className="relative min-h-[150px] overflow-hidden rounded-2xl md:hidden">
            <Image
              src={mobileHero}
              alt="hero"
              fill
              priority
              className="object-cover"
            />

            <div className="relative z-10 p-8">
              <h1 className="font-inter mb-2 text-lg font-semibold text-white">
                Record a live Meeting
              </h1>
              <p className="text-muted-foreground font-inter text-sm tracking-tighter">
                Works with Zoom, Google Meet, or Microsoft Teams
              </p>
              <div className="mt-8">
                <InputGroup className="w-full rounded-3xl py-6">
                  <InputGroupInput
                    placeholder="Paste meeting URL to add Meetassist"
                    className="rounded-2xl text-white placeholder:text-sm"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      variant="secondary"
                      className="font-inter cursor-pointer rounded-3xl px-2 py-4 text-xs font-normal"
                    >
                      Record meeting
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 block max-w-[200px] pb-4 md:hidden">
          <h1 className="font-inter text-xl font-medium">Schedule Meeting</h1>
          <CreateMeeting days={sortedDays} />
        </div>
        <div className="mt-6">
          <Meetings />
          <UpcomingMeeting />
        </div>
      </section>
    </>
  );
}
