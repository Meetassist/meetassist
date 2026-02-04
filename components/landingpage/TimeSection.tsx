import TimeImage1 from "@/public/time-img-1.jpg";
import TimeImage2 from "@/public/time-img-2.png";
import Image from "next/image";

export default function TimeSection() {
  return (
    <section className="mx-auto mt-[50px] w-full max-w-[95%] px-3 sm:mt-20 md:mt-[100px]">
      <div className="w-full">
        <h1 className="font-inter text-center text-3xl leading-[1.1] font-medium text-[#0A0613] md:text-6xl">
          There Isn’t that much <br /> Time in 24 Hours
        </h1>
        <p className="font-inter mt-4 text-center text-xs font-normal text-[#0A0613] sm:text-base md:text-xl">
          {" "}
          Get an AI Assistant that gives you value for time
        </p>
      </div>
      <div className="mt-5 flex flex-col gap-4 md:mt-8 md:flex-row">
        <div className="relative">
          <Image
            src={TimeImage1}
            alt="Person scheduling meetings and setting reminders"
            priority
            width={500}
            height={700}
            className="relative rounded-xl"
          />
          <div className="absolute top-0 z-10 px-4 py-6 sm:px-6 md:px-8">
            <h2 className="font-inter text-xl leading-[1.2] text-white sm:text-2xl md:text-3xl">
              Schedule, set Reminders <br /> and send Availability <br /> Link
              to colleagues
            </h2>
          </div>
        </div>
        <div className="h-[630px] flex-1 rounded-xl bg-[#18181F]">
          <div className="px-4 py-6 sm:px-6 md:px-8">
            <h2 className="font-inter text-xl leading-[1.2] text-white sm:text-2xl md:text-3xl">
              Miss no Details from <br /> your Virtual Meetings
            </h2>
            <p className="font-inter mt-2 text-[9px] leading-[1.4] font-normal text-[#C5C6CA] sm:text-sm">
              MeetAssist automatically captures notes, action items, and <br />
              key decisions so you stay fully informed without lifting a finger.
            </p>
          </div>
          <div className="flex items-center justify-center p-4 pt-1.5">
            <Image
              src={TimeImage2}
              alt="Virtual meeting notes and action items dashboard"
              width={450}
              height={400}
              priority
            />{" "}
          </div>
        </div>
      </div>
    </section>
  );
}
