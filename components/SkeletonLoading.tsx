import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function UserLoadingState() {
  return (
    <div
      className="flex items-center space-x-4"
      role="status"
      aria-label="Loading user information"
    >
      <Skeleton className="size-10 rounded-full" />
      <Skeleton className="h-10 w-[250px]" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function AvailabilityLoadingSkeleton() {
  return (
    <div className="mt-4 space-y-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-3">
          <div className="bg-accent size-10 shrink-0 rounded-full" />
          <div className="flex flex-1 items-center gap-3">
            <div className="bg-accent h-10 w-30 rounded-md" />
            <span className="text-accent">-</span>
            <div className="bg-accent h-10 w-30 rounded-md" />
            <div className="bg-accent h-10 w-8 rounded-md" />
            <div className="bg-accent h-10 w-8 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MeetingsLoadingSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          className="md:border-b-accent border-l-accent animate-pulse gap-5 rounded-2xl border-l-7 px-4 py-4 md:border-b-7 md:border-l-0"
        >
          <CardContent className="flex items-start justify-between md:items-center">
            {/* Left content */}
            <div className="flex-1">
              {/* Title section */}
              <div className="flex items-center gap-4">
                <div className="bg-accent size-5 rounded-xs" />
                <div className="bg-accent h-6 w-32 rounded-md sm:h-8 sm:w-40" />
              </div>

              {/* Details section */}
              <div className="space-y-2 pt-4">
                <div className="bg-accent h-3 w-48 rounded-md md:h-4 md:w-60" />
                <div className="bg-accent h-3 w-36 rounded-md md:h-4 md:w-44" />
              </div>
            </div>

            {/* Right buttons */}
            <div className="flex flex-col-reverse items-end justify-end gap-10 md:flex-row md:items-center md:gap-4">
              <div className="bg-accent size-9 rounded-md" />
              <div className="bg-accent size-9 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ScheduledMeetingsLoadingSkeleton() {
  return (
    <div className="mt-8 space-y-4 px-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          className="animate-pulse gap-5 rounded-2xl px-4 py-4 pr-6"
        >
          <CardContent>
            {/* Title */}
            <div className="flex items-center gap-4 pb-2">
              <div className="bg-accent h-5 w-40 rounded sm:h-6 sm:w-48 md:h-8 md:w-64" />
            </div>

            {/* Main content area */}
            <div className="flex items-center justify-between">
              {/* Date and time info */}
              <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                {/* Date skeleton */}
                <div className="flex items-center gap-2">
                  <div className="bg-accent size-3.5 shrink-0 rounded" />
                  <div className="bg-accent h-3 w-32 rounded sm:h-4 sm:w-40 md:w-48" />
                </div>

                {/* Time skeleton */}
                <div className="flex items-center gap-2">
                  <div className="bg-accent size-3.5 shrink-0 rounded" />
                  <div className="bg-accent h-3 w-24 rounded sm:h-4 sm:w-32" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col items-center gap-3 md:flex-row">
                <div className="bg-accent h-8 w-24 rounded-2xl sm:h-9 sm:w-28" />
                <div className="bg-accent h-8 w-24 rounded-2xl sm:h-9 sm:w-28" />
              </div>
            </div>

            {/* Location info */}
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <div className="bg-accent size-3.5 shrink-0 rounded" />
                <div className="bg-accent h-4 w-20 rounded sm:w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
