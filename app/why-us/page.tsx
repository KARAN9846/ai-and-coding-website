import { AnnouncementBar } from "@/components/layout/announcement-bar/announcement-bar";
import { Navbar } from "@/components/layout/navbar/navbar";
import { WhyUsHero } from "@/components/why-us/why-us-hero/why-us-hero";
import { WhyChoose } from "@/components/why-us/why-choose/why-choose";
import { HowYouLearn } from "@/components/why-us/how-you-learn/how-you-learn";
import { LearningSupport } from "@/components/why-us/learning-support/learning-support";
import { LearningOutcomes } from "@/components/why-us/learning-outcomes/learning-outcomes";
import { Enquiry } from "@/components/enquiry/enquiry";
import { Footer } from "@/components/layout/footer/footer";
import styles from "./page.module.css";

export default function WhyUsPage() {
  return (
    <main className={styles.page}>
      <AnnouncementBar />
      <Navbar />

      <WhyUsHero />
      <WhyChoose />
      <HowYouLearn />
      <LearningSupport />
      <LearningOutcomes />
      <Enquiry />
      <Footer />
    </main>
  );
}
