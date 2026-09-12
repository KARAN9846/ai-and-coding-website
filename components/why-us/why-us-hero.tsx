"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./why-us-hero.module.css";

export function WhyUsHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>WHY AI & CODING</span>

          <h1 className={styles.title}>
            <span>Learn With Purpose.</span>
            <span className={styles.titleAccent}>Build With Confidence.</span>
          </h1>

          <p className={styles.description}>
            A practical learning experience designed to help you build real
            skills, create meaningful projects, and move forward with
            confidence.
          </p>

          <div className={styles.actions}>
            <Link href="/courses" className={styles.primaryButton}>
              Explore Courses
            </Link>

            <Link href="#enquiry" className={styles.secondaryButton}>
              Enquire Now
            </Link>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.posterGlow} aria-hidden="true" />

          <Image
            src="/images/why-us/why-us-hero.png"
            alt="AI & Coding learning journey"
            width={1100}
            height={1300}
            priority
            className={styles.poster}
          />
        </div>
      </div>
    </section>
  );
}
