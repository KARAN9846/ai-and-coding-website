import styles from "./hero.module.css";
import { HeroVisual } from "./hero-visual";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroShell}>
        {/* =========================
            LEFT — HERO CONTENT
        ========================== */}

        <div className={styles.content}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />

            <span>AI &amp; CODING</span>

            <span className={styles.eyebrowLine} />

            <span>TECH EDUCATION</span>
          </div>

          <h1 id="hero-title" className={styles.title}>
            <span>Learn Today.</span>

            <span className={styles.gradientText}>Lead Tomorrow.</span>
          </h1>

          <p className={styles.description}>
            Build practical AI and coding skills through real projects, expert
            guidance, and technologies designed for the future.
          </p>

          <div className={styles.actions}>
            <a href="#programs" className={styles.primaryButton}>
              <span>Explore Programs</span>

              <span className={styles.buttonArrow}>↗</span>
            </a>

            <a href="#enquiry" className={styles.secondaryButton}>
              <span>Talk to Us</span>
            </a>
          </div>

          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>◇</span>

              <span>Real Projects</span>
            </div>

            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>✦</span>

              <span>Expert Mentorship</span>
            </div>

            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>◈</span>

              <span>Certification</span>
            </div>
          </div>
        </div>

        {/* =========================
            RIGHT — 3D AI VISUAL
        ========================== */}

        <div className={styles.visualArea} aria-hidden="true">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
