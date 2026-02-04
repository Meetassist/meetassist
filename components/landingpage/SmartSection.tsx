import DoMeetingImage from "@/public/DoMeetingImage.jpg";
import Liner from "@/public/liner.png";
import Image from "next/image";

export default function SmartSection() {
  return (
    <section className="relative w-full bg-gradient-to-br from-cyan-200 from-5% via-white via-25% to-white">
      <div className="relative mx-auto w-full max-w-[95%] px-3 py-5 md:py-15">
        <div className="w-full md:flex md:items-center md:justify-between">
          <div>
            <h2 className="font-satoshi text-5xl leading-[1.1] font-normal md:text-9xl">
              Do Meetings Smarter
            </h2>
            <p className="font-satoshi mt-4 text-sm font-normal sm:text-base md:text-xl">
              Can&apos;t attend? No problem! Record whatever you have to say in
              the meeting. <br />
              Meetassist will deliver and bring back feedback.
            </p>
          </div>
          <div>
            <div className="hidden px-10 pb-10 md:block">
              <Image src={Liner} alt="Liner" width={30} height={30} />
            </div>
            <div>
              <Image
                src={DoMeetingImage}
                alt="Do Meeting Image"
                width={450}
                height={450}
                className="hidden md:block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
