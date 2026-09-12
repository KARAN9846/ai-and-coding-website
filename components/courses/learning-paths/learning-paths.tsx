"use client";

import type { CSSProperties } from "react";
import { useAnimationVisibility } from "../../motion/use-animation-visibility";
import Link from "next/link";
import {
  ArrowUpRight,
  Braces,
  Code2,
  Database,
  FileText,
  Layers3,
  Palette,
  Search,
  Share2,
  Sparkles,
  Smartphone,
  Video,
} from "lucide-react";

import { usePointerMotion } from "../../motion/use-pointer-motion";
import styles from "./learning-paths.module.css";

type PathStage = {
  label: string;
  className: string;
  icon: typeof Code2;
};

const f2pStages: PathStage[] = [
  { label: "Foundation", className: styles.f2pFoundation, icon: Braces },
  { label: "Database", className: styles.f2pDatabase, icon: Database },
  { label: "Enterprise Java", className: styles.f2pJava, icon: Code2 },
  { label: "Specialization", className: styles.f2pSpecialization, icon: Layers3 },
  { label: "Mobile", className: styles.f2pMobile, icon: Smartphone },
];

const skillNodes: PathStage[] = [
  { label: "Design", className: styles.skillDesign, icon: Palette },
  { label: "Content", className: styles.skillContent, icon: FileText },
  { label: "Video", className: styles.skillVideo, icon: Video },
  { label: "SEO", className: styles.skillSeo, icon: Search },
  { label: "Social", className: styles.skillSocial, icon: Share2 },
  { label: "AI", className: styles.skillAi, icon: Sparkles },
];

const cardStyle = {
  "--mouse-x": "50%",
  "--mouse-y": "44%",
  "--path-x": "0px",
  "--path-y": "0px",
} as CSSProperties;

export function LearningPaths() {
  const motionRef = useAnimationVisibility();
  const pointer = usePointerMotion(cardStyle, (x, y) => ({
    "--mouse-x": `${x * 100}%`, "--mouse-y": `${y * 100}%`, "--path-x": `${(x-0.5)*10}px`, "--path-y": `${(y-0.5)*8}px`,
  }));
  return (
    <section
      ref={motionRef}
      id="courses-programs"
      className={styles.section}
      aria-labelledby="courses-programs-title"
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>EXPLORE OUR PROGRAMS</span>
            <span className={styles.eyebrowLine} />
          </div>

          <h2 id="courses-programs-title">
            Find the path that fits your goals.
          </h2>

          <p>
            Choose a structured professional journey or build practical digital
            skills for today&apos;s work.
          </p>
        </div>

        <div className={styles.cards}>
          <article
            className={`${styles.programCard} ${styles.f2pCard}`}
            {...pointer}
            style={cardStyle}
          >
            <div className={styles.cardGlow} />

            <div className={styles.cardHeader}>
              <span className={styles.meta}>Structured Program</span>
              <h3>F2P &mdash; Fresher to Professional</h3>
              <p>
                Build a strong technical foundation and progress through a
                structured path toward professional development.
              </p>
            </div>

            <div className={styles.f2pVisual} aria-hidden="true">
              <svg className={styles.f2pMap} viewBox="0 0 560 280" focusable="false">
                <path
                  className={styles.f2pRail}
                  d="M56 186 C132 88 220 88 278 146 S396 222 504 94"
                />
                <path
                  className={styles.f2pPulse}
                  d="M56 186 C132 88 220 88 278 146 S396 222 504 94"
                />
              </svg>

              <div className={styles.f2pCore}>
                <span />
              </div>

              {f2pStages.map((stage) => {
                const Icon = stage.icon;

                return (
                  <span
                    className={`${styles.pathNode} ${stage.className}`}
                    key={stage.label}
                  >
                    <span className={styles.nodeOrb}>
                      <Icon size={16} strokeWidth={1.75} />
                    </span>
                    <span className={styles.nodeText}>{stage.label}</span>
                  </span>
                );
              })}

              <span className={`${styles.pathParticle} ${styles.pathParticleOne}`} />
              <span className={`${styles.pathParticle} ${styles.pathParticleTwo}`} />
              <span className={`${styles.pathParticle} ${styles.pathParticleThree}`} />
            </div>

            <div className={styles.cardFooter}>
              <span>Foundation, database, Java, specialization, and mobile learning.</span>
              <Link href="/#programs-title" className={styles.cardLink}>
                <span>Explore F2P</span>
                <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </article>

          <article
            className={`${styles.programCard} ${styles.skillCard}`}
            {...pointer}
            style={cardStyle}
          >
            <div className={styles.cardGlow} />

            <div className={styles.cardHeader}>
              <span className={styles.meta}>Practical Skills</span>
              <h3>Skill Development</h3>
              <p>
                Build practical digital skills for today&apos;s work,
                creativity, and everyday professional needs.
              </p>
            </div>

            <div className={styles.skillVisual} aria-hidden="true">
              <svg className={styles.skillMap} viewBox="0 0 520 320" focusable="false">
                <path className={styles.skillLine} d="M260 160 L136 86" />
                <path className={styles.skillLine} d="M260 160 L384 86" />
                <path className={styles.skillLine} d="M260 160 L430 182" />
                <path className={styles.skillLine} d="M260 160 L350 262" />
                <path className={styles.skillLine} d="M260 160 L176 262" />
                <path className={styles.skillLine} d="M260 160 L88 176" />
              </svg>

              <div className={styles.skillCore}>
                <Sparkles size={28} strokeWidth={1.65} />
              </div>

              {skillNodes.map((skill) => {
                const Icon = skill.icon;

                return (
                  <span
                    className={`${styles.skillNode} ${skill.className}`}
                    key={skill.label}
                  >
                    <Icon size={15} strokeWidth={1.8} />
                    <span>{skill.label}</span>
                  </span>
                );
              })}

              <span className={`${styles.skillRing} ${styles.skillRingOne}`} />
              <span className={`${styles.skillRing} ${styles.skillRingTwo}`} />
              <span className={`${styles.skillDot} ${styles.skillDotOne}`} />
              <span className={`${styles.skillDot} ${styles.skillDotTwo}`} />
              <span className={`${styles.skillDot} ${styles.skillDotThree}`} />
            </div>

            <div className={styles.cardFooter}>
              <span>Design, content, video, SEO, social media, portfolio, and AI tools.</span>
              <a href="#skill-development" className={styles.cardLink}>
                <span>Explore Skills</span>
                <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
