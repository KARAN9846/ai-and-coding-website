import styles from "./announcement-bar.module.css";

export function AnnouncementBar() {
  return (
    <aside className={styles.bar} aria-label="Important announcement">
      <div className={styles.inner}>
        <div className={styles.message}>
          <span className={styles.status} aria-hidden="true">
            <span className={styles.statusDot} />
          </span>

          <span className={styles.label}>Admissions Open</span>

          <span className={styles.separator} aria-hidden="true">
            •
          </span>

          <span className={styles.description}>AI &amp; Coding Programs</span>
        </div>

        <a className={styles.action} href="#enquiry">
          <span>Enquire Now</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </aside>
  );
}
