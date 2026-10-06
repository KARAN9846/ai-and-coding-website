import type { Metadata } from "next";

import { AnnouncementBar } from "@/components/layout/announcement-bar/announcement-bar";
import { Footer } from "@/components/layout/footer/footer";
import { Navbar } from "@/components/layout/navbar/navbar";
import { AudiencePaths } from "@/components/workshops/audience-paths/audience-paths";
import { WorkshopDiscountCountdown } from "@/components/workshops/workshop-discount-countdown/workshop-discount-countdown";
import { WorkshopHero } from "@/components/workshops/workshop-hero/workshop-hero";
import { WorkshopRegistrationOptions } from "@/components/workshops/workshop-registration-intro/workshop-registration-options";
import { WorkshopTracks } from "@/components/workshops/workshop-tracks/workshop-tracks";
import { getWorkshopConfiguration } from "@/lib/workshops/configuration-server";
import { toPublicWorkshopConfiguration, type PublicWorkshopConfiguration } from "@/lib/workshops/public-configuration";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "AI Workshops | AI & Coding",
  description:
    "Practical offline AI workshops for students, professionals, beginners and developers — from AI tools and prompting to AI-assisted software development.",
};

export const dynamic = "force-dynamic";

export default async function WorkshopsPage() {
  let initialConfiguration: PublicWorkshopConfiguration | null = null;
  try {
    initialConfiguration = toPublicWorkshopConfiguration(
      await getWorkshopConfiguration(),
    );
  } catch (error) {
    console.error("Workshop page configuration load failed:", error);
  }

  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar />
      <WorkshopHero initialConfiguration={initialConfiguration} />
      <WorkshopDiscountCountdown initialConfiguration={initialConfiguration} />
      <AudiencePaths />
      <WorkshopTracks initialConfiguration={initialConfiguration} />
      <WorkshopRegistrationOptions initialConfiguration={initialConfiguration} />
      <Footer />
    </main>
  );
}
