export const dynamic = "force-dynamic";
import { RecordingButton } from "@/components/ChatContent/RecordingButton";
import { RecordingDetails } from "@/components/ChatContent/RecordingDetails";
import { DetailsSkeleton, SidebarSkeleton } from "@/components/SkeletonLoading";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Chat",
  description: "Chat with MeetAssist about your conversations",
  robots: {
    index: false,
    follow: false,
  },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  return (
    <section className="px-4 pb-4 md:px-6">
      <header className="hidden py-5 md:block">
        <InputGroup className="max-w-[500px] rounded-lg py-5">
          <InputGroupInput
            aria-label="Ask or Search"
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
        <Suspense fallback={<DetailsSkeleton />}>
          <RecordingDetails searchParams={searchParams} />
        </Suspense>

        <div className="hidden w-[300px] shrink-0 md:block">
          <h3 className="text-muted-foreground mb-4 px-4 text-sm font-semibold tracking-wider uppercase">
            Recent Recordings
          </h3>
          <Suspense fallback={<SidebarSkeleton />}>
            <RecordingButton searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
