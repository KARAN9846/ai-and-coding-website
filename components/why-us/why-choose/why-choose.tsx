"use client";

import {
  BriefcaseBusiness,
  BrainCircuit,
  Code2,
  Compass,
  Lightbulb,
  Presentation,
} from "lucide-react";
import styles from "./why-choose.module.css";

export default function WhyChoose() {
  return (
    <section className={styles.section} aria-labelledby="why-choose-title">
      <div className={styles.container}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>WHY CHOOSE AI & CODING</span>

          <h2 id="why-choose-title">
            Learning That Turns Into <span>Real Skills.</span>
          </h2>

          <p>
            We believe learning should be practical, engaging, and connected to
            real-world outcomes.
          </p>
        </div>

        <div className={styles.workshop}>
          {/* Desktop / tablet connection system */}
          <svg
            className={`${styles.connections} ${styles.connectionsDesktop}`}
            viewBox="0 0 1080 620"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* glow layer */}
            <g className={styles.connectionGlow}>
              <path d="M540 275 C540 225 540 170 540 115" />
              <path d="M405 300 C350 270 305 235 255 220" />
              <path d="M675 300 C730 270 775 235 825 220" />
              <path d="M405 390 C350 405 305 420 255 425" />
              <path d="M675 390 C730 405 775 420 825 425" />
              <path d="M540 440 C540 485 540 515 540 555" />
            </g>

            {/* sharp connection layer */}
            <g className={styles.connectionLine}>
              <path d="M540 275 C540 225 540 170 540 115" />
              <path d="M405 300 C350 270 305 235 255 220" />
              <path d="M675 300 C730 270 775 235 825 220" />
              <path d="M405 390 C350 405 305 420 255 425" />
              <path d="M675 390 C730 405 775 420 825 425" />
              <path d="M540 440 C540 485 540 515 540 555" />
            </g>

            {/* connection nodes */}
            <g className={styles.connectionNodes}>
              <circle cx="540" cy="115" r="4" />
              <circle cx="255" cy="220" r="4" />
              <circle cx="825" cy="220" r="4" />
              <circle cx="255" cy="425" r="4" />
              <circle cx="825" cy="425" r="4" />
              <circle cx="540" cy="555" r="4" />
            </g>
          </svg>

          {/* Mobile connection system */}
          <svg
            className={`${styles.connections} ${styles.connectionsMobile}`}
            viewBox="0 0 600 1000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <g className={styles.connectionGlow}>
              <path d="M300 155 L300 390" />
              <path d="M120 285 C175 310 220 350 250 410" />
              <path d="M480 285 C425 310 380 350 350 410" />
              <path d="M250 590 C220 650 175 690 120 715" />
              <path d="M350 590 C380 650 425 690 480 715" />
              <path d="M300 790 L300 905" />
            </g>

            <g className={styles.connectionLine}>
              <path d="M300 155 L300 390" />
              <path d="M120 285 C175 310 220 350 250 410" />
              <path d="M480 285 C425 310 380 350 350 410" />
              <path d="M250 590 C220 650 175 690 120 715" />
              <path d="M350 590 C380 650 425 690 480 715" />
              <path d="M300 790 L300 905" />
            </g>

            <g className={styles.connectionNodes}>
              <circle cx="300" cy="155" r="4" />
              <circle cx="120" cy="285" r="4" />
              <circle cx="480" cy="285" r="4" />
              <circle cx="120" cy="715" r="4" />
              <circle cx="480" cy="715" r="4" />
              <circle cx="300" cy="905" r="4" />
            </g>
          </svg>

          {/* Top node */}
          <div className={`${styles.node} ${styles.nodeTop}`}>
            <div className={styles.nodeIcon}>
              <Lightbulb aria-hidden="true" />
            </div>

            <div className={styles.nodeContent}>
              <h3>Practical Learning</h3>
              <p>Learn through hands-on practice and real applications.</p>
            </div>
          </div>

          {/* Left top */}
          <div className={`${styles.node} ${styles.nodeLeftTop}`}>
            <div className={styles.nodeIcon}>
              <Code2 aria-hidden="true" />
            </div>

            <div className={styles.nodeContent}>
              <h3>Real Projects</h3>
              <p>Turn what you learn into meaningful, working projects.</p>
            </div>
          </div>

          {/* Right top */}
          <div className={`${styles.node} ${styles.nodeRightTop}`}>
            <div className={styles.nodeIcon}>
              <BrainCircuit aria-hidden="true" />
            </div>

            <div className={styles.nodeContent}>
              <h3>Expert Mentorship</h3>
              <p>Get guidance while learning, building, and improving.</p>
            </div>
          </div>

          {/* Left bottom */}
          <div className={`${styles.node} ${styles.nodeLeftBottom}`}>
            <div className={styles.nodeIcon}>
              <Presentation aria-hidden="true" />
            </div>

            <div className={styles.nodeContent}>
              <h3>Workshops &amp; Bootcamps</h3>
              <p>Focused learning experiences beyond routine classes.</p>
            </div>
          </div>

          {/* Right bottom */}
          <div className={`${styles.node} ${styles.nodeRightBottom}`}>
            <div className={styles.nodeIcon}>
              <BriefcaseBusiness aria-hidden="true" />
            </div>

            <div className={styles.nodeContent}>
              <h3>Career Focus</h3>
              <p>Build practical skills connected to real-world work.</p>
            </div>
          </div>

          {/* Bottom */}
          <div className={`${styles.node} ${styles.nodeBottom}`}>
            <div className={styles.nodeIcon}>
              <Compass aria-hidden="true" />
            </div>

            <div className={styles.nodeContent}>
              <h3>Future-Ready Skills</h3>
              <p>Explore modern AI, coding, and digital technologies.</p>
            </div>
          </div>

          {/* Central hub */}
          <div className={styles.hub}>
            <div className={styles.hubGlow} />

            <div className={styles.hubIcon}>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="7"
                  y="7"
                  width="10"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M9 1V4M12 1V4M15 1V4M9 20V23M12 20V23M15 20V23"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <path
                  d="M20 9H23M20 12H23M20 15H23M1 9H4M1 12H4M1 15H4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <path
                  d="M10 10H14V14H10V10Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </div>

            <div className={styles.hubTitle}>AI &amp; CODING</div>

            <div className={styles.hubSubtitle}>Learn. Practice. Build.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
