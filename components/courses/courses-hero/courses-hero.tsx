"use client";

import type { CSSProperties } from "react";
import { useAnimationVisibility } from "../../motion/use-animation-visibility";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  BrainCircuit,
  Code2,
  Database,
  Layers3,
  Palette,
} from "lucide-react";

import { usePointerMotion } from "../../motion/use-pointer-motion";
import styles from "./courses-hero.module.css";

const heroStyle = {
  "--mouse-x": "62%",
  "--mouse-y": "46%",
  "--tilt-x": "0deg",
  "--tilt-y": "0deg",
  "--visual-x": "0px",
  "--visual-y": "0px",
} as CSSProperties;

const learningNodes = [
  {
    label: "AI",
    icon: BrainCircuit,
    className: "nodeAi",
  },
  {
    label: "CODE",
    icon: Code2,
    className: "nodeCode",
  },
  {
    label: "DATA",
    icon: Database,
    className: "nodeData",
  },
  {
    label: "DESIGN",
    icon: Palette,
    className: "nodeDesign",
  },
  {
    label: "BUILD",
    icon: Blocks,
    className: "nodeBuild",
  },
  {
    label: "CREATE",
    icon: Layers3,
    className: "nodeCreate",
  },
];

export function CoursesHero() {
  const motionRef = useAnimationVisibility();
  const pointer = usePointerMotion(heroStyle, (x, y) => ({
    "--mouse-x": `${x * 100}%`,
    "--mouse-y": `${y * 100}%`,
    "--tilt-x": `${(0.5 - y) * 4}deg`,
    "--tilt-y": `${(x - 0.5) * 5}deg`,
    "--visual-x": `${(x - 0.5) * 12}px`,
    "--visual-y": `${(y - 0.5) * 10}px`,
  }));

  return (
    <section
      ref={motionRef}
      id="courses-hero"
      className={styles.hero}
      aria-labelledby="courses-hero-title"
      {...pointer}
      style={heroStyle}
    >
      <div className={styles.shell}>
        <div className={styles.content}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            <span>COURSES &amp; PROGRAMS</span>
            <span className={styles.eyebrowLine} />
          </div>

          <h1 id="courses-hero-title" className={styles.title}>
            <span>Learn Skills.</span>
            <span className={styles.gradientText}>Build Your Future.</span>
          </h1>

          <p className={styles.description}>
            Explore practical learning paths designed around real skills,
            projects, mentorship, and future-ready technologies.
          </p>

          <div className={styles.actions}>
            <Link href="/#programs-title" className={styles.primaryButton}>
              <span>Explore Programs</span>
              <ArrowUpRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>

            <a href="#enquiry" className={styles.secondaryButton}>
              <span>Enquire Now</span>
              <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={styles.visualColumn} aria-hidden="true">
          <div className={styles.learningVisual}>
            <div className={styles.visualGlow} />
            {learningNodes.map((node) => {
              const Icon = node.icon;

              return (
                <div
                  className={`${styles.learningNode} ${styles[node.className]}`}
                  key={node.label}
                >
                  <span className={styles.nodeIcon}>
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className={styles.nodeLabel}>{node.label}</span>
                </div>
              );
            })}
            <div className={styles.visualObject}>
              <svg
                className={styles.connectionMap}
                viewBox="0 0 520 520"
                role="presentation"
                focusable="false"
              >
                <defs>
                  <linearGradient id="courses-connection" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
                    <stop offset="52%" stopColor="currentColor" stopOpacity="0.72" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path className={styles.connectionLine} d="M260 260 L143 142" />
                <path className={styles.connectionLine} d="M260 260 L377 132" />
                <path className={styles.connectionLine} d="M260 260 L424 278" />
                <path className={styles.connectionLine} d="M260 260 L342 414" />
                <path className={styles.connectionLine} d="M260 260 L154 398" />
                <path className={styles.connectionLine} d="M260 260 L93 268" />
                <path className={styles.connectionArc} d="M143 142 C248 66 342 74 377 132" />
                <path className={styles.connectionArc} d="M424 278 C420 374 382 418 342 414" />
                <path className={styles.connectionArc} d="M154 398 C84 344 70 304 93 268" />
              </svg>

              <div className={`${styles.orbit} ${styles.orbitOne}`}>
                <span />
              </div>
              <div className={`${styles.orbit} ${styles.orbitTwo}`}>
                <span />
              </div>
              <div className={`${styles.orbit} ${styles.orbitThree}`}>
                <span />
              </div>
              <div className={`${styles.orbit} ${styles.orbitFour}`}>
                <span />
              </div>

              <div className={styles.coreSystem}>
                <div className={styles.coreHalo} />
                <div className={styles.coreShell}>
                  <span className={styles.coreFacet} />
                  <span className={styles.coreFacet} />
                  <span className={styles.coreFacet} />
                  <span className={styles.coreCenter} />
                </div>
              </div>
              <div className={styles.ribbonLayer}>
                <span className={`${styles.ribbon} ${styles.ribbonOne}`} />
                <span className={`${styles.ribbon} ${styles.ribbonTwo}`} />
                <span className={`${styles.ribbon} ${styles.ribbonThree}`} />
              </div>

              <span className={`${styles.dataDot} ${styles.dataDotOne}`} />
              <span className={`${styles.dataDot} ${styles.dataDotTwo}`} />
              <span className={`${styles.dataDot} ${styles.dataDotThree}`} />
              <span className={`${styles.dataDot} ${styles.dataDotFour}`} />
              <span className={`${styles.particle} ${styles.particleOne}`} />
              <span className={`${styles.particle} ${styles.particleTwo}`} />
              <span className={`${styles.particle} ${styles.particleThree}`} />
              <span className={`${styles.particle} ${styles.particleFour}`} />
              <span className={`${styles.particle} ${styles.particleFive}`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
