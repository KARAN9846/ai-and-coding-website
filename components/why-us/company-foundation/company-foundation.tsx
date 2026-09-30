"use client";

import Image from "next/image";

import { useAnimationVisibility } from "../../motion/use-animation-visibility";
import styles from "./company-foundation.module.css";

export function CompanyFoundation() {
  const motionRef = useAnimationVisibility();

  return (
    <section
      ref={motionRef}
      className={styles.section}
      aria-labelledby="company-foundation-title"
    >
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.brandPanel}>
          <span className={styles.label}>Parent company</span>

          <div className={styles.logoFrame}>
            <Image
              src="/images/why-us/nyalkaran-logo-light.svg"
              alt="Nyalkaran Technosoft LLP"
              width={2168}
              height={535}
              className={`${styles.logo} ${styles.logoForDarkTheme}`}
            />

            <Image
              src="/images/why-us/nyalkaran-logo-dark.svg"
              alt="Nyalkaran Technosoft LLP"
              width={2168}
              height={535}
              className={`${styles.logo} ${styles.logoForLightTheme}`}
            />
          </div>
        </div>

        <div className={styles.connection} aria-hidden="true">
          <span />
        </div>

        <div className={styles.message}>
          <span className={styles.label}>AI &amp; Coding initiative</span>

          <h2 id="company-foundation-title">
            Powered by Nyalkaran Technosoft LLP.
            <span>Focused on Future-Ready Learning.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
