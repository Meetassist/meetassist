"use client";
import MainLogo from "@/public/main-logo.jpg";
import { Google, Microsoft, Slack, Zoom } from "@/utils/svgs";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NavDropMenu } from "./Dropdown";
const ProductContent = [
  {
    id: 1,
    header: "Calendar",
    content:
      "Automatically record and transcribe meetings scheduled in your calendar",
  },
  {
    id: 2,
    header: "Notes",
    content:
      "Automatically share meeting notes and summary in your note-taking app",
  },
  {
    id: 3,
    header: "Video Conferencing",
    content:
      "Record and transcribe meetings from Google Meet, Zoom & other apps",
  },
  {
    id: 4,
    header: "AI Proxy Assistant",
    content:
      "Get an AI Assistant that joins meetings for you when you are busy, it listens and brings you the meeting summary & feedback",
  },
];

export function Navbar() {
  return (
    <nav className="mx-auto hidden w-full max-w-[95%] items-center justify-between px-3 pt-1.5 pb-3 md:flex">
      <Image src={MainLogo} alt="Meetassist_Logo" width={150} height={150} />
      <NavDropMenu />
      <div>
        <div className="flex items-center gap-4">
          <Link href={"/login"} className="font-inter text-base font-medium">
            Login
          </Link>
          <div className="bg-border h-10 w-px shrink-0" />
          <Link
            href="/login"
            className="bg-primary rounded-sm px-3 py-2 text-sm font-medium text-white"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function MobileNavbar() {
  const [openNav, setOpenNav] = useState<boolean>(false);
  const [isIntegrationOpen, setIsIntegrationOpen] = useState<boolean>(false);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = openNav ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [openNav]);

  return (
    <>
      <nav className="mx-auto flex w-full max-w-[95%] items-center justify-between pt-3 md:hidden">
        <Image src={MainLogo} alt="Meetassist_Logo" width={100} height={100} />
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpenNav(true)}
          className="cursor-pointer p-2"
        >
          <Menu size={20} />
        </button>
      </nav>

      {openNav && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white p-4 text-[#221606]">
          <div className="flex justify-end">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpenNav(false)}
              className="p-2"
            >
              <X size={24} />
            </button>
          </div>

          <ul className="mt-4 flex flex-col gap-5 text-xl font-medium">
            <li>Products</li>

            <li className="flex flex-col">
              <button
                onClick={() => setIsIntegrationOpen(!isIntegrationOpen)}
                className="flex w-full items-center justify-between py-2"
              >
                <span>Integration</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-200 ${isIntegrationOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isIntegrationOpen && (
                <div className="flex flex-col gap-6 pt-4 pb-6">
                  <div className="flex flex-col gap-5">
                    {ProductContent.map((item) => (
                      <div key={item.id} className="group">
                        <h3 className="font-inter text-base font-semibold text-[#0A0613]">
                          {item.header}
                        </h3>
                        <p className="font-inter mt-1 text-sm text-[#646566]">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-center gap-3">
                      {[Microsoft, Google, Zoom, Slack].map((Icon, idx) => (
                        <div
                          key={idx}
                          className="rounded-md border border-[#DFDFDF] p-3"
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <h2 className="text-sm font-semibold">
                        Connect Meetassist to your favorite tools
                      </h2>
                      <Link
                        href="/login"
                        className="text-primary mt-1 flex items-center gap-2 text-sm font-medium hover:underline"
                      >
                        Browse Integrations <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://t.me/meetassist"
              >
                Join Our Community
              </a>
            </li>
            <li>
              <a href="mailto:Meetassist.ai@gmail.com">Contact us</a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
