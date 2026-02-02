import { getUserSession } from "@/lib/getSession";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Suspense } from "react";
import { UserLoadingState } from "./SkeletonLoading";
async function UserInfo() {
  const session = await getUserSession();
  if (!session?.user) {
    return null;
  }

  const initials =
    session.user.name
      ?.split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage
          src={session.user.image || "/image.png"}
          alt={session.user.name || "User avatar"}
          className="size-8"
        />
        <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
      </Avatar>
      <p className="text-xl font-medium">
        {session.user.name || "Unknown User"}
      </p>
    </div>
  );
}
export function HeaderUserInfo() {
  return (
    <Suspense fallback={<UserLoadingState />}>
      <UserInfo />
    </Suspense>
  );
}
