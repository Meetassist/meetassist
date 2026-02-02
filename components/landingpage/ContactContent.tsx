import ContactImage from "@/public/authimage.jpg";
import Image from "next/image";
import { Button } from "../ui/button";
export default function ContactContent() {
  return (
    <section className="flex w-full gap-3 px-4 py-10">
      <div className="w-full rounded-4xl md:w-[50%] md:bg-[#F7F9FD]">
        <div className="px-4 pt-20 md:px-10">
          <h1 className="max-w-[360px] text-4xl font-bold text-[#221606] md:max-w-[400px] md:text-5xl">
            Get in Touch with the Meetassist Team
          </h1>
          <p className="mt-4 max-w-[350px] text-xs font-medium text-[#22160685] md:max-w-[500px] md:text-base">
            We&apos;re here to help! Reach out to us with any questions or
            support needs, and we&apos;ll get back to you as soon as possible.
          </p>
          <Button
            asChild
            className="mt-8 w-full rounded-full py-6 text-base font-medium text-white"
          >
            <a href="mailto:Meetassist.ai@gmail.com">Send message</a>
          </Button>
        </div>
      </div>

      <Image
        src={ContactImage}
        alt="Contact the Meetassist team"
        width={1000}
        className="hidden w-[50%] rounded-4xl md:block"
      />
    </section>
  );
}
