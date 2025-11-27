import { Card, CardContent, CardTitle } from "./ui/card";
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

export function MeetingLoadingStates() {
  return (
    <>
      <div className="relative mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="border-b-primary gap-5 rounded-2xl border-b-7 px-4 py-4"
          >
            <CardTitle className="flex items-center gap-4">
              <Skeleton className="size-5 rounded-xs" />
              <Skeleton className="size-5 rounded-xs" />
            </CardTitle>
            <CardContent className="flex items-center justify-between">
              <div>
                <div>
                  <Skeleton className="h-4 w-full rounded-xs" />
                  <Skeleton className="h-4 w-full rounded-xs" />
                </div>{" "}
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-6">
                  <Skeleton className="h-4 w-full rounded-xs" />
                  <Skeleton className="h-4 w-full rounded-xs" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
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
