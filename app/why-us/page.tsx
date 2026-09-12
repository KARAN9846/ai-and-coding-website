import { AnnouncementBar } from "@/components/announcement-bar/announcement-bar";
import { Navbar } from "@/components/navbar/navbar";
import { WhyUsHero } from "@/components/why-us/why-us-hero";
import { Enquiry } from "@/components/enquiry/enquiry";
import { Footer } from "@/components/footer/footer";
import styles from "./page.module.css";

export default function WhyUsPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar />

      <WhyUsHero />

      <Enquiry />
      <Footer />
    </main>
  );
}
