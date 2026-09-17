"use client";

import Link from "next/link";
import { ArrowRight, MessageSquareText, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useAnimationVisibility } from "../motion/use-animation-visibility";
import styles from "./enquiry-cta.module.css";

type EnquiryCtaProps = {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  description?: string;
};

const PHONE_DISPLAY = "+91 99044 25105";
const PHONE_HREF = "tel:+919904425105";
const WHATSAPP_HREF =
  "https://wa.me/919904425105?text=Hello%2C%20I%27d%20like%20to%20know%20more%20about%20the%20AI%20%26%20Coding%20learning%20programs.";

export function EnquiryCta({
  eyebrow = "READY TO START?",
  title = "Let’s Talk About",
  highlight = "What You Want to Build.",
  description = "Tell us your goal, ask your questions, and get a clear idea of the most practical next step for you.",
}: EnquiryCtaProps) {
  const motionRef = useAnimationVisibility();

  return (
    <section
      ref={motionRef}
      className={styles.section}
      aria-labelledby="enquiry-title"
    >
      <div className={styles.backgroundGrid} aria-hidden="true" />
      <div className={styles.backgroundGlow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.panel}>
          <div className={styles.content}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              <span>{eyebrow}</span>
            </div>

            <h2 id="enquiry-title">
              {title}
              <span>{highlight}</span>
            </h2>

            <p>{description}</p>
          </div>

          <div className={styles.actionsArea}>
            <div className={styles.actionsHeader}>
              <span>CHOOSE WHAT WORKS FOR YOU</span>
              <p>Start with an enquiry, message us, or call directly.</p>
            </div>

            <div className={styles.actions}>
              <Link
                href="/enquiry#learner-enquiry"
                className={`${styles.action} ${styles.primaryAction}`}
              >
                <span
                  className={`${styles.actionIcon} ${styles.enquireIcon}`}
                  aria-hidden="true"
                >
                  <MessageSquareText size={20} strokeWidth={1.9} />
                </span>

                <span className={styles.actionText}>
                  <strong>Enquire Now</strong>
                  <small>Share your goals and questions</small>
                </span>

                <ArrowRight
                  className={styles.actionArrow}
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>

              <a
                href={WHATSAPP_HREF}
                className={`${styles.action} ${styles.whatsappAction}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  className={`${styles.actionIcon} ${styles.whatsappIcon}`}
                  aria-hidden="true"
                >
                  <FaWhatsapp size={21} />
                </span>

                <span className={styles.actionText}>
                  <strong>WhatsApp</strong>
                  <small>Chat with us directly</small>
                </span>

                <ArrowRight
                  className={styles.actionArrow}
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </a>

              <a
                href={PHONE_HREF}
                className={`${styles.action} ${styles.callAction}`}
              >
                <span
                  className={`${styles.actionIcon} ${styles.callIcon}`}
                  aria-hidden="true"
                >
                  <Phone size={19} strokeWidth={1.9} />
                </span>

                <span className={styles.actionText}>
                  <strong>Call Us</strong>
                  <small>{PHONE_DISPLAY}</small>
                </span>

                <ArrowRight
                  className={styles.actionArrow}
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </a>
            </div>

            <div className={styles.note}>
              <span className={styles.noteDot} aria-hidden="true" />
              <span>No pressure — just clear guidance on your next step.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
