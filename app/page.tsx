import { AnnouncementBar } from "@/components/announcement-bar/announcement-bar";
import { Navbar } from "@/components/navbar/navbar";
import { Hero } from "@/components/hero/hero";
import { ChoosePath } from "@/components/choose-path/choose-path";
import { Programs } from "@/components/programs/programs";

export default function Home() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <ChoosePath />
      <Programs />
    </main>
  );
}
