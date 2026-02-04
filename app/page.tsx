import ChatSection from "@/components/landingpage/ChatSection";
import FeaturesSection from "@/components/landingpage/FeaturesSection";
import Footer from "@/components/landingpage/Footer";
import HeroSection from "@/components/landingpage/HeroSection";
import { MobileNavbar, Navbar } from "@/components/landingpage/Navbar";
import SmartSection from "@/components/landingpage/SmartSection";
import TimeSection from "@/components/landingpage/TimeSection";

export default async function Home() {
  return (
    <main className="">
      <Navbar />
      <MobileNavbar />
      <HeroSection />
      <TimeSection />
      <ChatSection />
      <FeaturesSection />
      <SmartSection />
      <Footer />
    </main>
  );
}
