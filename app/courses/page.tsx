import { AnnouncementBar } from "@/components/layout/announcement-bar/announcement-bar";
import { CoursesHero } from "@/components/courses/courses-hero/courses-hero";
import { DailyLiveBanner } from "@/components/courses/daily-live-banner/daily-live-banner";
import { F2PJourney } from "@/components/courses/f2p-journey/f2p-journey";
import { LearningPaths } from "@/components/courses/learning-paths/learning-paths";
import { SkillDevelopment } from "@/components/courses/skill-development/skill-development";
import { EnquiryCta } from "@/components/enquiry-cta/enquiry-cta";
import { Footer } from "@/components/layout/footer/footer";
import { Navbar } from "@/components/layout/navbar/navbar";

import styles from "./page.module.css";

export default function CoursesPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar />
      <CoursesHero />
      <DailyLiveBanner />
      <LearningPaths />
      <F2PJourney />
      <SkillDevelopment />
      <EnquiryCta />
      <Footer />
    </main>
  );
}
