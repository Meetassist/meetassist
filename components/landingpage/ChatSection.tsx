import ChatImage1 from "@/public/chatImage-1.jpg";
import ChatImage2 from "@/public/chatImage-2.jpg";
import Image from "next/image";
import Link from "next/link";

export default function ChatSection() {
  return (
    <section className="mx-auto mt-4 w-full max-w-[95%] px-3">
      <div className="relative w-full">
        <Image
          src={ChatImage1}
          alt="AI assistant providing meeting insights"
          className="relative rounded-xl"
        />
        <div className="absolute top-0 z-10 px-6 pt-3 sm:px-8 md:px-10 md:pt-20">
          <h2 className="font-inter text-xs leading-[1.2] text-[#0A0613] sm:text-base md:text-3xl">
            Ask your AI Assistant for Insights
          </h2>
          <p className="font-inter mt-1 text-[7px] font-normal text-[#C5C6CA] md:mt-4 md:text-sm">
            Get instant summaries, key takeaways, and action items from any
            meeting.
          </p>
        </div>
      </div>
      <div className="mt-14 hidden md:block">
        <Image
          src={ChatImage2}
          alt="Meeting assistant dashboard overview"
          className="rounded-xl"
        />
        <div className="mt-6 flex flex-col items-center">
          <p className="font-inter text-3xl font-medium tracking-wide capitalize">
            Your #1 Meeting Assistant
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="bg-primary rounded-sm px-5 py-3.5 text-base font-medium text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
