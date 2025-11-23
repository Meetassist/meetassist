import { Bell, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { getUserSession } from "@/lib/getSession";

export default async function Header() {
  let session;
  try {
    session = await getUserSession();
  } catch (error) {
    console.error("Failed to fetch user session:", error);
    return null;
  }
  return (
    <header className="flex items-center gap-[254px] p-5 px-10">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={session?.user?.image || "/image.png"}
            alt="current user"
            className="size-8"
          />
          <AvatarFallback className="rounded-lg">
            {session?.user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <p className="text-xl font-medium">{session?.user?.name}</p>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <InputGroup className="flex-1 rounded-lg py-5">
            <InputGroupInput
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
          <button
            className="border-border rounded-xs border p-2"
            aria-label="View notifications"
          >
            <Bell size={18} />
          </button>{" "}
        </div>
      </div>
    </header>
  );
}
