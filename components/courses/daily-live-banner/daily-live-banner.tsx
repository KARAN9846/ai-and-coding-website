import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Radio } from "lucide-react";

import dailyLiveImage from "@/public/images/courses/daily-live/daily-live-tech-learning.png";
import styles from "./daily-live-banner.module.css";

export function DailyLiveBanner() {
  return (
    <section className={styles.section} aria-label="Daily live tech learning">
      <Link href="/enquiry#learner-enquiry-form" className={styles.banner}>
        <div className={styles.content}>
          <span className={styles.liveLabel}>
            <Radio
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
              className={styles.onlineIcon}
            />

            <span className={styles.onlineText}>ONLINE</span>
            <span className={styles.liveText}>
              <span className={styles.liveDot} aria-hidden="true" />
              LIVE
            </span>
          </span>
          <h2 className={styles.title}>
            Daily Live
            <br />
            <span>Tech Learning</span>
          </h2>
          <p className={styles.audience}>
            For Beginners • Tech Enthusiasts • Working Professionals
          </p>
          <div className={styles.actions}>
            <p className={styles.schedule}>
              <span>Every Day</span>
              <strong>
                9:30 <span>PM</span>
              </strong>
            </p>
            <span className={styles.cta}>
              Enquire Now
              <span className={styles.arrow}>
                <ArrowUpRight size={19} strokeWidth={2} aria-hidden="true" />
              </span>
            </span>
          </div>
        </div>

        <div className={styles.visual}>
          <Image
            src={dailyLiveImage}
            alt="Instructor teaching an online tech class with students joining by video."
            fill
            sizes="(max-width: 620px) calc(100vw - 32px), (max-width: 1148px) 48vw, 530px"
            quality={90}
            className={styles.image}
          />
        </div>
      </Link>
    </section>
  );
}
