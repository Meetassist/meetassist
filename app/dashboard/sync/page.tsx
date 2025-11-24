import { ConnectButton } from "@/components/ConnectButton";
import { DisconnectButton } from "@/components/DisconnectButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getNylasConnectionStatus } from "@/lib/actions/nylasAction";
import Image from "next/image";

const SYNC = [
  {
    id: 1,
    image: "/sync_1.svg",
    name: "Google Meet",
    content:
      "Bring recorded video of your Google Meet meetings to the platform",
    current: "Disconnect",
  },
  {
    id: 2,
    image: "/sync_2.svg",
    name: "Zoom",
    content: "Bring recorded video of your Zoom meetings to the platform",
    current: "Disconnect",
  },
  {
    id: 3,
    image: "/sync_3.svg",
    name: "Microsoft Teams",
    content:
      "Bring recorded video of your Microsoft Teams meetings to the platform",
    current: "Disconnect",
  },
];
export default async function Page() {
  let isConnected = false;
  let connection = null;

  try {
    const result = await getNylasConnectionStatus();
    isConnected = result.isConnected;
    connection = result.connection;
  } catch (error) {
    console.error("Failed to fetch Nylas connection status:", error);
  }

  return (
    <section className="mt-10 px-10">
      <div>
        <h1 className="font-instrument text-foreground text-[32px] font-medium">
          Sync
        </h1>
        <p className="text-muted-foreground mt-4 text-base font-medium">
          Supercharge your workflow by syncing our platform with your favorite
          apps.
        </p>
      </div>
      <div className="mt-8 pb-8">
        <div className="space-y-6">
          <Card className="border-border rounded-none border-x-0 border-t-0 border-b shadow-none">
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <Image
                  src={"/sync_4.svg"}
                  alt={"Calendar & Contacts"}
                  width={40}
                  height={40}
                />
                <div>
                  <p className="font-instrument text-xl font-medium">
                    Calendar & Contacts
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Sync your calendar and contacts to streamline scheduling and
                    communication
                  </p>
                </div>
              </div>
              {isConnected && connection ? (
                <DisconnectButton />
              ) : (
                <ConnectButton />
              )}
            </CardContent>
          </Card>
          {SYNC.map((sync) => (
            <Card
              key={sync.id}
              className="border-border rounded-none border-x-0 border-t-0 border-b shadow-none"
            >
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <Image
                    src={sync.image}
                    alt={sync.name}
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className="font-instrument text-xl font-medium">
                      {sync.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {sync.content}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  disabled={true}
                  variant={sync.current === "Disconnect" ? "ghost" : "default"}
                  className={`font-instrument cursor-pointer rounded-sm py-5 ${sync.current === "Disconnect" ? "border-border text-foreground border" : "text-white"} `}
                >
                  {sync.current}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

{
  /* <Button asChild>
          <Link href={"/api/auth"}>
            <Calendar className="mr-2 size-4" />
            Connect calender to your account
          </Link>
        </Button> */
}
