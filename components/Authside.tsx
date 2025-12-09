import Image from "next/image";
import authImage from "@/public/authimage.jpg";
export function Authside() {
  return (
    <div className="hidden min-h-dvh w-full bg-gradient-to-br from-[#BEB2FE] via-[#EDF1FE] to-[#FAFBFF] md:block md:flex-1">
      <div className="mr-4 flex min-h-dvh items-center justify-center">
        <Image
          src={authImage}
          alt="auth-image"
          width={1200}
          height={1200}
          className="rounded-r-2xl object-cover"
        />
      </div>
    </div>
  );
}
