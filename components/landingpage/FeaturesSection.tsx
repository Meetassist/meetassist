import ToolImage from "@/public/toolImage.png";
import {
  BotMessageSquare,
  CalendarDays,
  CircleCheckBig,
  CircleUserRound,
  NotebookPen,
  Shield,
} from "lucide-react";
import Image from "next/image";
const FeaturedContent = [
  {
    id: 1,
    svg: BotMessageSquare,
    header: "AI Note Taker",
    content:
      "Joins your meetings and generates structured notes with key action items and summaries.",
  },
  {
    id: 2,
    svg: CalendarDays,
    header: "Smart Scheduling",
    content:
      "Calendly like booking system with Google Calendar and Outlook integration for seamless planning.",
  },
  {
    id: 3,
    svg: CircleUserRound,
    header: "Meeting Proxy",
    content:
      "Can't attend? Your AI assistant joins on your behalf and provides complete meeting summaries.",
  },
  {
    id: 4,
    svg: NotebookPen,
    header: "Instant Transcripts",
    content:
      "Get real-time transcriptions and searchable meeting records for easy reference and sharing.",
  },
  {
    id: 5,
    svg: CircleCheckBig,
    header: "Export & Share",
    content:
      "Download notes in multiple formats or share meeting summaries with your team instantly.",
  },
  {
    id: 6,
    svg: Shield,
    header: "Enterprise Security",
    content:
      "Bank-grade encryption and compliance with GDPR, SOC 2, and other security standards.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="product"
      className="mt-10 w-full bg-gradient-to-b from-[#3525D2] from-60% to-[#1B136C] sm:mt-15 md:mt-20"
    >
      <div className="mx-auto w-full max-w-[95%] px-3">
        <div className="flex w-full flex-col items-center justify-center py-10">
          <p className="font-instrument rounded-full border border-[#A09FAC] px-4 py-2 text-center text-xl font-medium text-white">
            Features For You ⚡
          </p>
          <div className="mt-10">
            <h2 className="font-instrument text-2xl font-semibold text-white sm:text-3xl md:text-6xl">
              Built for Individuals & Teams
            </h2>
            <p className="font-instrument mt-3 text-center text-xs font-normal text-[#C8CBD7] sm:text-base md:text-xl">
              The AI tool built to save your time. I step into meetings,
              document everything with <br /> precision, and manage your
              reminders, so you can focus on what truly matters
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:mt-10 lg:grid-cols-3">
          {FeaturedContent.map((item) => (
            <div
              key={item.id}
              className="h-55 rounded-sm bg-[#0C1671] p-4 px-6"
            >
              <div className="w-fit rounded-full bg-[#2C379F] p-3">
                <item.svg className="text-white" />
              </div>
              <h2 className="font-instrument mt-4 text-xl font-medium text-white">
                {item.header}
              </h2>
              <p className="font-instrument mt-4 text-sm font-medium text-[#C3C9D1]">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col items-center justify-center py-10 sm:py-15 md:py-20">
          <p className="font-instrument rounded-full border border-[#A09FAC] px-4 py-2 text-center text-xl font-medium text-white">
            Tools For You 👨‍💻
          </p>
          <h1 className="font-instrument mt-10 text-center text-2xl font-semibold text-white sm:text-3xl md:text-6xl">
            Connect Meetassist to Tools <br /> you already use
          </h1>
          <p className="font-instrument mt-4 font-medium text-[#DFE2E7] md:text-xl">
            From calendars to task managers, Meetassist fits right into your
            workflow.
          </p>
          <div className="mt-12 md:mt-10">
            <Image
              src={ToolImage}
              alt="Tools that can be connected"
              width={800}
              height={500}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
