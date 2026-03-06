export const dynamic = "force-dynamic";
import {
  ConnectGoogleMeetButton,
  ConnectMicrosoftButton,
} from "@/components/ConnectButton";
import {
  DisconnectGoogleButton,
  DisconnectMicrosoftButton,
} from "@/components/DisconnectButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllConnectionStatuses } from "@/utils/helper";
import { Google, MicrosoftTeams, Zoom } from "@/utils/svgs";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sync Integrations",
  description: "Sync your calendar, contacts, and meeting platforms",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  let connectionStatuses;
  try {
    connectionStatuses = await getAllConnectionStatuses();
  } catch (error) {
    console.error("Failed to fetch connection statuses:", error);
    return (
      <section className="mt-10 px-6">
        <p className="text-destructive">
          Unable to load integration statuses. Please try again later.
        </p>
      </section>
    );
  }

  const {
    googleConnection,
    isGoogleConnected,
    isMicrosoftConnected,
    microsoftConnection,
  } = connectionStatuses;
  return (
    <section className="mt-10 px-4 md:px-6">
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
                <Google className="h-10 w-10" />
                <div>
                  <p className="font-instrument text-xl font-medium">
                    Google Calendar
                  </p>
                  <p className="text-muted-foreground hidden text-sm md:block">
                    Sync your calendar and contacts to streamline scheduling and
                    communication
                  </p>
                </div>
              </div>
              {isGoogleConnected && googleConnection ? (
                <DisconnectGoogleButton />
              ) : (
                <ConnectGoogleMeetButton
                  text="Connect"
                  variant="default"
                  styles="rounded-sm border py-5 text-white bg-primary"
                />
              )}
            </CardContent>
          </Card>
          {/* <Card className="border-border rounded-none border-x-0 border-t-0 border-b shadow-none">
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <Zoom className="h-10 w-10" />
                <div>
                  <p className="font-instrument text-xl font-medium">Zoom</p>
                  <p className="text-muted-foreground hidden text-sm md:block">
                    Bring recorded video of your Zoom meetings to the platform
                  </p>
                </div>
              </div>

              {isZoomConnected && zoomConnection ? (
                <DisconnectZoomButton />
              ) : (
                <ConnectZoomButton
                  text="Connect"
                  variant="default"
                  styles="rounded-sm border py-5 text-white bg-primary"
                />
              )}
            </CardContent>
          </Card> */}
          <Card className="border-border rounded-none border-x-0 border-t-0 border-b shadow-none">
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <MicrosoftTeams className="h-10 w-10" />
                <div>
                  <p className="font-instrument text-xl font-medium">
                    Microsoft Teams
                  </p>
                  <p className="text-muted-foreground hidden text-sm md:block">
                    Bring recorded video of your Microsoft Teams meetings to the
                    platform
                  </p>
                </div>
              </div>
              {isMicrosoftConnected && microsoftConnection ? (
                <DisconnectMicrosoftButton />
              ) : (
                <ConnectMicrosoftButton
                  variant="default"
                  text="Connect"
                  styles="rounded-sm border py-5 text-white bg-primary"
                />
              )}
            </CardContent>
          </Card>
          <Card className="border-border rounded-none border-x-0 border-t-0 border-b shadow-none">
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <Zoom className="h-10 w-10" />
                <div>
                  <p className="font-instrument text-xl font-medium">Zoom</p>
                  <p className="text-muted-foreground hidden text-sm md:block">
                    Bring recorded video of your Zoom meetings to the platform
                  </p>
                </div>
              </div>

              <div className="relative">
                <Button
                  disabled={true}
                  className="rounded-sm py-5 text-white disabled:cursor-not-allowed"
                >
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
