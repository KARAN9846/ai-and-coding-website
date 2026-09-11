"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useAnimationVisibility } from "../motion/use-animation-visibility";
import { ArrowRight, Mail, MessageCircle, Phone, Sparkles } from "lucide-react";

import styles from "./enquiry.module.css";

const sectionStyle = {
  "--mouse-x": "50%",
  "--mouse-y": "44%",
  "--visual-x": "0px",
  "--visual-y": "0px",
} as CSSProperties;

const contactOptions = [
  {
    label: "Call",
    value: "9913006732",
    href: "tel:+919913006732",
    icon: Phone,
  },
  {
    label: "WhatsApp",
    value: "9727701949",
    href: "https://wa.me/919727701949",
    icon: MessageCircle,
  },
  {
    label: "Email",
    value: "nyalkarantechnosoft@gmail.com",
    href: "mailto:nyalkarantechnosoft@gmail.com",
    icon: Mail,
  },
];

export function Enquiry() {
  const motionRef = useAnimationVisibility();
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const section = event.currentTarget;
    const rect = section.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    section.style.setProperty("--mouse-x", `${(x * 100).toFixed(2)}%`);
    section.style.setProperty("--mouse-y", `${(y * 100).toFixed(2)}%`);
    section.style.setProperty("--visual-x", `${((x - 0.5) * 10).toFixed(2)}px`);
    section.style.setProperty("--visual-y", `${((y - 0.5) * 8).toFixed(2)}px`);
  };

  const resetPointer = (event: PointerEvent<HTMLElement>) => {
    const section = event.currentTarget;

    section.style.setProperty("--mouse-x", "50%");
    section.style.setProperty("--mouse-y", "44%");
    section.style.setProperty("--visual-x", "0px");
    section.style.setProperty("--visual-y", "0px");
  };

  return (
    <section
      ref={motionRef}
      id="enquiry"
      className={styles.section}
      aria-labelledby="enquiry-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      style={sectionStyle}
    >
      <div className={styles.container}>
        <div className={styles.panel}>
          <div className={styles.visual} aria-hidden="true">
            <div className={`${styles.orbit} ${styles.orbitOne}`} />
            <div className={`${styles.orbit} ${styles.orbitTwo}`} />
            <div className={`${styles.orbit} ${styles.orbitThree}`} />
            <span className={`${styles.dataDot} ${styles.dataDotOne}`} />
            <span className={`${styles.dataDot} ${styles.dataDotTwo}`} />
            <span className={`${styles.dataDot} ${styles.dataDotThree}`} />
            <div className={styles.core}>
              <Sparkles size={34} strokeWidth={1.45} />
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              <span>READY TO START?</span>
              <span className={styles.eyebrowLine} />
            </div>

            <h2 id="enquiry-title">Ready to Build Your Future?</h2>

            <p>
              Talk to our team and find the right learning path for your goals,
              interests, and experience.
            </p>

            <a href="#enquiry" className={styles.primaryCta}>
              <span>Enquire Now</span>
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>

          <div className={styles.contacts} aria-label="Contact options">
            {contactOptions.map((option) => {
              const Icon = option.icon;

              return (
                <a
                  className={styles.contact}
                  href={option.href}
                  key={option.label}
                >
                  <span className={styles.contactIcon} aria-hidden="true">
                    <Icon size={17} strokeWidth={1.8} />
                  </span>
                  <span>
                    <span className={styles.contactLabel}>{option.label}</span>
                    <span className={styles.contactValue}>{option.value}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
