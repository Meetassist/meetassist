import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-10">
      <div className="w-full">
        <h1 className="font-satoshi text-center text-[10vw] font-bold text-[#E4E4E4]">
          MeetAssist
        </h1>
      </div>
      <Spinner className="h-10 w-10" aria-label="Loading state" />
    </div>
  );
}
