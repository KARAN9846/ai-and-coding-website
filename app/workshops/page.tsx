import type { Metadata } from "next";

import { AnnouncementBar } from "@/components/layout/announcement-bar/announcement-bar";
import { Footer } from "@/components/layout/footer/footer";
import { Navbar } from "@/components/layout/navbar/navbar";
import { AudiencePaths } from "@/components/workshops/audience-paths/audience-paths";
import { WorkshopDiscountCountdown } from "@/components/workshops/workshop-discount-countdown/workshop-discount-countdown";
import { WorkshopHero } from "@/components/workshops/workshop-hero/workshop-hero";
import { WorkshopRegistrationOptions } from "@/components/workshops/workshop-registration-intro/workshop-registration-options";
import { WorkshopTracks } from "@/components/workshops/workshop-tracks/workshop-tracks";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "AI Workshops | AI & Coding",
  description:
    "Practical offline AI workshops for students, professionals, beginners and developers — from AI tools and prompting to AI-assisted software development.",
};

export default function WorkshopsPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar />
      <WorkshopHero />
      <WorkshopDiscountCountdown />
      <AudiencePaths />
      <WorkshopTracks />
      <WorkshopRegistrationOptions />
      <Footer />
    </main>
  );
}
