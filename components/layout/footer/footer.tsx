import Link from "next/link";

import { Mail, MapPin, Phone } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

import styles from "./footer.module.css";

const PHONE_DISPLAY = "+91 99044 25105";
const PHONE_HREF = "tel:+919904425105";
const EMAIL = "nyalkarantechnosoft@gmail.com";
const ADDRESS = "233, Harihar Shopping, Bharuch, Gujarat - 392012";
const MAP_HREF = "https://maps.app.goo.gl/fbG4f3DzjqQ3CDzVA";

const WHATSAPP_HREF =
  "https://wa.me/919904425105?text=Hello%2C%20I%27d%20like%20to%20know%20more%20about%20the%20AI%20%26%20Coding%20learning%20programs.";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses#explore-programs" },
  { label: "Why Us", href: "/why-us" },
];

const programLinks = [
  { label: "F2P - Fresher to Professional", href: "/courses#f2p-program" },
  { label: "Skill Development", href: "/courses#skill-development" },
  { label: "AI Tools for Creators", href: "/courses#ai-tools-for-creators" },
];

const socials = [
  {
    label: "Visit Nyalkaran Technosoft LLP on LinkedIn",
    href: "https://www.linkedin.com/company/nyalkaran-technosoft-llp/",
    icon: FaLinkedinIn,
    className: styles.linkedin,
  },
  {
    label: "Follow AI & Coding on Instagram",
    href: "https://www.instagram.com/ai.coding_bharuch?igsi=eXVoaWUwejZoNzlp",
    icon: FaInstagram,
    className: styles.instagram,
  },
  {
    label: "Contact AI & Coding on WhatsApp",
    href: WHATSAPP_HREF,
    icon: FaWhatsapp,
    className: styles.whatsapp,
  },
];

export function Footer() {
  return (
    <footer className={styles.footer} aria-labelledby="footer-brand">
      <div className={styles.backgroundGrid} aria-hidden="true" />

      <div className={styles.shell}>
        <div className={styles.main}>
          <div className={styles.brandArea}>
            <Link
              href="/"
              className={styles.brand}
              aria-label="AI & Coding home"
            >
              <span className={styles.brandMark} aria-hidden="true">
                <span className={styles.brandMarkCore} />
              </span>

              <span id="footer-brand" className={styles.brandName}>
                AI <span>&amp;</span> Coding
              </span>
            </Link>

            <p className={styles.tagline}>Learn Today. Lead Tomorrow.</p>

            <p className={styles.description}>
              Practical AI and coding education built around real projects,
              clear guidance, and skills you can actually use.
            </p>

            <div className={styles.socials} aria-label="Social media links">
              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`${styles.socialButton} ${social.className}`}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          <nav className={styles.column} aria-label="Footer explore links">
            <h2>Explore</h2>

            <ul>
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.column} aria-label="Footer program links">
            <h2>Programs</h2>

            <ul>
              {programLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={`${styles.column} ${styles.contactColumn}`}>
            <h2>Contact</h2>

            <div className={styles.contactList}>
              <a href={PHONE_HREF} className={styles.contactLink}>
                <span
                  className={`${styles.contactIcon} ${styles.phoneIcon}`}
                  aria-hidden="true"
                >
                  <Phone size={15} strokeWidth={1.9} />
                </span>

                <span>{PHONE_DISPLAY}</span>
              </a>

              <a href={`mailto:${EMAIL}`} className={styles.contactLink}>
                <span
                  className={`${styles.contactIcon} ${styles.mailIcon}`}
                  aria-hidden="true"
                >
                  <Mail size={15} strokeWidth={1.9} />
                </span>

                <span>{EMAIL}</span>
              </a>

              <a
                href={MAP_HREF}
                className={`${styles.contactLink} ${styles.addressLink}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  className={`${styles.contactIcon} ${styles.addressIcon}`}
                  aria-hidden="true"
                >
                  <MapPin size={15} strokeWidth={1.9} />
                </span>

                <span className={styles.addressText}>
                  233, Harihar Shopping,
                  <br />
                  Bharuch, Gujarat - 392012
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>&copy; 2026 AI &amp; Coding. All rights reserved.</p>
          <p>A Nyalkaran Technosoft LLP Initiative</p>
        </div>
      </div>
    </footer>
  );
}
