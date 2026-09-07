import { AnnouncementBar } from "@/components/announcement-bar/announcement-bar";
import { Navbar } from "@/components/navbar/navbar";
import { Hero } from "@/components/hero/hero";
import { ChoosePath } from "@/components/choose-path/choose-path";
import { Programs } from "@/components/programs/programs";
import { WhyAiCoding } from "@/components/why-ai-coding/why-ai-coding";
import { Enquiry } from "@/components/enquiry/enquiry";
import { Footer } from "@/components/footer/footer";

export default function Home() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <ChoosePath />
      <Programs />
      <WhyAiCoding />
      <Enquiry />
      <Footer />
    </main>
  );
}
