import { Bell, SearchIcon } from "lucide-react";
import { Suspense } from "react";
import { HeaderUserInfo } from "./HeaderUserInfo";
import { UserLoadingState } from "./SkeletonLoading";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export default function Header() {
  return (
    <header className="hidden items-center gap-[254px] p-5 px-10 md:flex">
      <Suspense fallback={<UserLoadingState />}>
        <HeaderUserInfo />
      </Suspense>
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
          </button>
        </div>
      </div>
    </header>
  );
}
