import MainLogo from "@/public/main-logo.jpg";
import { Instagram, XformerlyTwitter } from "@/utils/svgs";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[95%] px-3 pt-14 pb-4">
      <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Image
            src={MainLogo}
            alt="Meetassist logo"
            width={150}
            height={150}
            className="-ml-3.5"
          />
        </div>
        <div>
          <h3 className="font-satoshi text-base font-normal text-[#808380]">
            {" "}
            Pages
          </h3>
          <div className="flex flex-col gap-3">
            <p>Product</p>
            <p>Integration</p>
            <p>Join a Community</p>
            <p>Contact Us</p>
          </div>
        </div>
        <div>
          <h1 className="font-satoshi text-base font-normal text-[#808380]">
            Social Links
          </h1>
          <div className="mt-3 flex items-center gap-3 md:mt-6">
            <a
              href="https://twitter.com/meetassistAI"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <XformerlyTwitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/meetassist.ai/?hl=en"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="w-full">
        <h2 className="font-satoshi text-center text-[15vw] font-bold text-[#E4E4E4] md:text-[18.5vw]">
          MeetAssist
        </h2>
      </div>
      <p className="font-inter text-xs font-normal text-[#8E8E8E] md:text-base">
        Copyright © 2026 Meetassist. All rights reserved.
      </p>
    </footer>
  );
}
