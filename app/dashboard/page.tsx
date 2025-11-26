import Header from "@/components/Header";
import { Meetings } from "@/components/meetings/Meetings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  CalendarDays,
  Clock2,
  Ellipsis,
  MapPinCheckInside,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <Header />
      <section className="mt-4 px-10">
        <div>
          <div className="relative">
            <Image
              src={"/home-hero.svg"}
              alt="hero"
              width={1034}
              priority
              height={228}
              className="rounded-3xl object-cover"
            />
            <div className="absolute top-[50px] left-[42px]">
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
        </div>
        <div className="mt-6">
          <h2 className="text-foreground font-instrument text-2xl font-medium">
            Meeting Link
          </h2>
          <div className="mt-4 space-y-5">
            <Meetings />
            <Card className="gap-5 rounded-2xl border-b-7 border-b-[#C479A4] px-4 py-4">
              <CardTitle className="flex items-center gap-4">
                <div className="size-[23px] rounded-xs bg-[#C479A4]" />
                <p className="font-instrument text-2xl font-medium">
                  Single Use Link
                </p>
              </CardTitle>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#AEAEAE]">
                    30 min Google meet, one-on-one
                  </p>
                  <p className="text-sm text-[#AEAEAE]">One Time meet link</p>
                </div>
                <div className="flex items-center gap-6">
                  <Button
                    variant={"ghost"}
                    type="button"
                    className="border-border cursor-pointer rounded-2xl border text-sm"
                  >
                    <RefreshCw />
                    Regenerate Link
                  </Button>
                  <Button
                    type="button"
                    variant={"ghost"}
                    className="border-foreground size-3 cursor-pointer rounded-sm border p-2 py-3"
                  >
                    <Ellipsis />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 pb-10">
            <h3 className="text-foreground font-instrument text-2xl font-medium">
              Upcoming Meeting
            </h3>
            <div className="mt-4 space-y-5">
              <Card className="gap-5 rounded-2xl px-4 py-4 pr-10">
                <CardTitle className="flex items-center gap-4">
                  <p className="font-instrument text-2xl font-medium">
                    Product Strategy Meeting
                  </p>
                </CardTitle>
                <CardContent className="flex items-center justify-between px-0">
                  <div className="flex items-center gap-6">
                    <p className="flex items-center gap-2 text-sm font-normal text-[#AEAEAE]">
                      <CalendarDays size={14} />
                      2025-10-31
                    </p>

                    <p className="flex items-center gap-2 text-sm font-normal text-[#AEAEAE]">
                      <Clock2 size={14} />
                      2025-10-31
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <Button
                      type="button"
                      className="font-inter cursor-pointer rounded-2xl text-xs font-medium text-white"
                    >
                      Join Meeting
                    </Button>
                    <Button
                      variant={"ghost"}
                      type="button"
                      className="border-border font-inter cursor-pointer rounded-2xl border text-xs font-medium"
                    >
                      <RefreshCw />
                      Reschedule
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="px-0 pt-0">
                  <p className="flex items-center gap-2 font-normal text-[#AEAEAE]">
                    <MapPinCheckInside size={14} />
                    Google Meet
                  </p>
                </CardFooter>
              </Card>
              <Card className="gap-5 rounded-2xl px-4 py-4 pr-10">
                <CardTitle className="flex items-center gap-4">
                  <p className="font-instrument text-2xl font-medium">
                    Product Strategy Meeting
                  </p>
                </CardTitle>
                <CardContent className="flex items-center justify-between px-0">
                  <div className="flex items-center gap-6">
                    <p className="flex items-center gap-2 text-sm font-normal text-[#AEAEAE]">
                      <CalendarDays size={14} />
                      2025-10-31
                    </p>

                    <p className="flex items-center gap-2 text-sm font-normal text-[#AEAEAE]">
                      <Clock2 size={14} />
                      2025-10-31
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <Button
                      type="button"
                      className="font-inter cursor-pointer rounded-2xl text-xs font-medium text-white"
                    >
                      Join Meeting
                    </Button>
                    <Button
                      variant={"ghost"}
                      type="button"
                      className="border-border font-inter cursor-pointer rounded-2xl border text-xs font-medium"
                    >
                      <RefreshCw />
                      Reschedule
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="px-0 pt-0">
                  <p className="flex items-center gap-2 font-normal text-[#AEAEAE]">
                    <MapPinCheckInside size={14} />
                    Google Meet
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
