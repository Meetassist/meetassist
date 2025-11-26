import { TimeAvailable } from "@/components/availability/TimeAvailable";
import { Separator } from "@/components/ui/separator";
import { Availability } from "@/lib/actions/availabilityAction";

export default async function Page() {
  const data = await Availability();
  if (!data) {
    return (
      <section className="px-6 py-5">
        <p>Failed to load availability data. Please try again.</p>
      </section>
    );
  }

  return (
    <section className="px-6 py-5">
      <div>
        <h1 className="font-instrument text-3xl font-medium">Availability</h1>
        <p className="font-instrument text-muted-foreground mt-2 text-base font-medium">
          Set up your work time availability
        </p>{" "}
        <Separator className="mt-4" />
      </div>
      <div className="mt-3">
        <h2 className="font-instrument text-2xl font-medium">Weekly Hours</h2>
        <p className="font-instrument text-muted-foreground mt-2 text-base font-medium">
          Set when you are typically available for meetings
        </p>
      </div>
      <TimeAvailable data={data} />
    </section>
  );
}
