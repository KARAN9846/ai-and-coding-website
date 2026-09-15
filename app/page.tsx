import { AnnouncementBar } from "@/components/layout/announcement-bar/announcement-bar";
import { Navbar } from "@/components/layout/navbar/navbar";
import { Hero } from "@/components/home/hero/hero";
import { ChoosePath } from "@/components/home/choose-path/choose-path";
import { Programs } from "@/components/home/programs/programs";
import { WhyAiCoding } from "@/components/home/why-ai-coding/why-ai-coding";
import { EnquiryCta } from "@/components/enquiry-cta/enquiry-cta";
import { Footer } from "@/components/layout/footer/footer";

export default function Home() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <ChoosePath />
      <Programs />
      <WhyAiCoding />
      <EnquiryCta />
      <Footer />
    </main>
  );
}
