import { Sparkles } from "lucide-react";

import styles from "./enquiry-hero.module.css";

export function EnquiryHero() {
  return (
    <section className={styles.hero} aria-labelledby="enquiry-page-title">
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.shell}>
        <div className={styles.content}>
          <div className={styles.eyebrow}>
            <Sparkles size={13} strokeWidth={2} aria-hidden="true" />
            <span>LET&apos;S CONNECT</span>
          </div>

          <h1 id="enquiry-page-title">
            Start the Right <span>Conversation.</span>
          </h1>

          <p>
            Tell us what you&apos;re looking for and we&apos;ll help you take
            the next practical step.
          </p>
        </div>
      </div>
    </section>
  );
}
