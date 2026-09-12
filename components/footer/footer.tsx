import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

import styles from "./footer.module.css";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/#programs-title" },
  { label: "Why Us", href: "/#why-ai-coding-title" },
  { label: "About", href: "/#footer-brand" },
];

const programLinks = [
  { label: "F2P - Fresher to Professional", href: "/#programs-title" },
  { label: "Skill Development", href: "/#programs-title" },
  { label: "AI Tools for Creators", href: "/#programs-title" },
];

const contacts = [
  { label: "9913006732", href: "tel:+919913006732", icon: Phone },
  { label: "9727701949", href: "tel:+919727701949", icon: Phone },
  {
    label: "nyalkarantechnosoft@gmail.com",
    href: "mailto:nyalkarantechnosoft@gmail.com",
    icon: Mail,
  },
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
    href: "https://wa.me/919904425105",
    icon: FaWhatsapp,
    className: styles.whatsapp,
  },
];

export function Footer() {
  return (
    <footer className={styles.footer} aria-labelledby="footer-brand">
      <div className={styles.shell}>
        <div className={styles.grid}>
          <div className={styles.brandArea}>
            <div className={styles.brandVisual} aria-hidden="true">
              <span className={styles.brandOrb} />
              <span className={styles.brandLine} />
              <span className={styles.brandDot} />
            </div>

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
              expert guidance, and future-ready skills.
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
                    <Icon size={20} aria-hidden="true" />
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

          <nav className={styles.column} aria-label="Footer programs links">
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
            <h2>Get in Touch</h2>
            <ul>
              {contacts.map((contact) => {
                const Icon = contact.icon;

                return (
                  <li key={contact.href}>
                    <a href={contact.href} className={styles.contactLink}>
                      <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                      <span>{contact.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <a href="#enquiry" className={styles.cta}>
              <span>Enquire Now</span>
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </div>

        <p className={styles.statement}>
          Build skills. Create projects. Shape your future.
        </p>

        <div className={styles.bottomBar}>
          <p>&copy; 2026 AI &amp; Coding. All rights reserved.</p>
          <p>A Nyalkaran Technosoft LLP Initiative</p>
        </div>
      </div>
    </footer>
  );
}
