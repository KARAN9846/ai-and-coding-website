import { AnnouncementBar } from "@/components/announcement-bar/announcement-bar";
import { CoursesHero } from "@/components/courses/courses-hero/courses-hero";
import { F2PJourney } from "@/components/courses/f2p-journey/f2p-journey";
import { LearningPaths } from "@/components/courses/learning-paths/learning-paths";
import { Enquiry } from "@/components/enquiry/enquiry";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";

import styles from "./page.module.css";

export default function CoursesPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar />
      <CoursesHero />
      <LearningPaths />
      <F2PJourney />
      <Enquiry />
      <Footer />
    </main>
  );
}
