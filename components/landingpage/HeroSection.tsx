import HeroImage from "@/public/hero-img.jpg";
import UserImage from "@/public/users.jpg";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="mx-auto mt-6 flex w-full max-w-[95%] flex-col gap-4 px-2 md:items-center md:justify-between md:gap-0 lg:flex-row">
      <div className="md:flex md:min-h-96 md:flex-col">
        <p className="font-inter text-sm font-semibold tracking-wide capitalize">
          Your #1 Meeting Assistant
        </p>

        <div>
          <h1 className="font-inter mt-2 text-3xl leading-[1.1] font-medium text-[#0A0613] md:text-5xl">
            Turn Conversations <br />
            Into <span className="text-blue-600">Insights</span>
          </h1>
        </div>

        <div className="md:mt-4">
          <p className="font-inter hidden leading-7 font-normal text-[#474545] md:block">
            Hi, I’m MeetAssist your AI meeting assistant. <br /> I join your
            meetings, take accurate notes, organize everything, <br /> and set
            smart reminders so nothing gets missed.
          </p>

          <div className="mt-10 md:mt-8">
            <Link
              href="/login"
              className="bg-primary rounded-sm px-5 py-3 text-sm font-medium text-white sm:text-base"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-7 md:mt-auto">
          <Image
            src={UserImage}
            alt="Profile photos of satisfied users"
            priority
            width={50}
            height={50}
          />

          <p className="font-inter text-xs font-medium md:text-base">
            5.0⭐️️ Review from 500+ Tested Users
          </p>
        </div>
      </div>
      <div>
        <Image
          src={HeroImage}
          alt="AI assistant helping during a meeting"
          priority
          width={550}
          height={550}
        />
      </div>
    </section>
  );
}
