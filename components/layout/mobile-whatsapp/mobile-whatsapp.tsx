import { FaWhatsapp } from "react-icons/fa";

import styles from "./mobile-whatsapp.module.css";

const WHATSAPP_HREF =
  "https://wa.me/919904425105?text=Hello%2C%20I%27d%20like%20to%20know%20more%20about%20the%20AI%20%26%20Coding%20learning%20programs.";

export function MobileWhatsApp() {
  return (
    <a
      href={WHATSAPP_HREF}
      className={styles.whatsappButton}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with AI & Coding on WhatsApp"
    >
      <FaWhatsapp size={25} aria-hidden="true" />
    </a>
  );
}
