export const dynamic = "force-dynamic";
import { TimeAvailable } from "@/components/availability/TimeAvailable";
import { AvailabilityLoadingSkeleton } from "@/components/SkeletonLoading";
import { Separator } from "@/components/ui/separator";
import { Availability } from "@/lib/actions/availabilityAction";
import type { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Availability Settings | Meetassist",
  description: "Set up your work time availability for meetings",
  robots: {
    index: false,
    follow: false,
  },
};

async function AvailabilityContent() {
  try {
    const data = await Availability();
    if (data === null || data === undefined) {
      return (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">
            Failed to load availability data. Please try again.
          </p>
        </div>
      );
    }
    return <TimeAvailable data={data} />;
  } catch (error) {
    console.error(error);
    return (
      <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
        <p className="text-red-600">
          Failed to load availability data. Please try again.
        </p>
      </div>
    );
  }
}
export default function Page() {
  return (
    <section className="overflow-x-hidden px-4 py-5 md:px-6">
      <div>
        <h1 className="font-instrument text-3xl font-medium">Availability</h1>
        <p className="font-instrument text-muted-foreground mt-2 text-xs font-medium sm:text-base">
          Set up your work time availability
        </p>
        <Separator className="mt-4" />
      </div>
      <div className="mt-3">
        <h2 className="font-instrument text-2xl font-medium">Weekly Hours</h2>
        <p className="font-instrument text-muted-foreground mt-2 text-base font-medium">
          Set when you are typically available for meetings
        </p>
      </div>
      <Suspense fallback={<AvailabilityLoadingSkeleton />}>
        <AvailabilityContent />
      </Suspense>
    </section>
  );
}
