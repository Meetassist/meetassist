export const dynamic = "force-dynamic";
import Header from "@/components/Header";
import CreateMeeting from "@/components/meetings/CreateMeetingButtonMobile";
import { Meetings } from "@/components/meetings/Meetings";
import { UpcomingMeeting } from "@/components/meetings/UpcomingEvent";
import { RecordingInput } from "@/components/RecordingInput";
import { getUserSession } from "@/lib/getSession";
import db from "@/lib/prisma";
import { getAllConnectionStatuses } from "@/utils/helper";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getUserSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const days = await db.availability.findMany({
    where: { userId: session.user.id, isActive: true },
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

  const { isGoogleConnected, isMicrosoftConnected, isZoomConnected } =
    await getAllConnectionStatuses();
  return (
    <>
      <Header />
      <section className="mt-1 px-4 md:px-6">
        <RecordingInput />
        <div className="mt-4 block max-w-[200px] pb-4 md:hidden">
          <h1 className="font-inter text-xl font-medium">Schedule Meeting</h1>
          <CreateMeeting
            isGoogleConnected={isGoogleConnected}
            isMicrosoftConnected={isMicrosoftConnected}
            isZoomConnected={isZoomConnected}
            days={sortedDays}
            button={false}
          />
        </div>
        <div className="mt-6">
          <Meetings />
          <UpcomingMeeting />
        </div>
      </section>
    </>
  );
}
