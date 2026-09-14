"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Blocks, BookOpenCheck, Braces, RefreshCw } from "lucide-react";

import { useAnimationVisibility } from "../../motion/use-animation-visibility";
import styles from "./how-you-learn.module.css";

type StageKey = "learn" | "practice" | "build" | "improve";

type LearningStage = {
  key: StageKey;
  number: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const stages: LearningStage[] = [
  {
    key: "learn",
    number: "01",
    label: "UNDERSTAND",
    title: "Learn",
    description:
      "Build a clear foundation with guided explanations, examples, and structured concepts.",
    icon: BookOpenCheck,
  },
  {
    key: "practice",
    number: "02",
    label: "APPLY",
    title: "Practice",
    description:
      "Strengthen your understanding through focused exercises, challenges, and hands-on tasks.",
    icon: Braces,
  },
  {
    key: "build",
    number: "03",
    label: "CREATE",
    title: "Build",
    description:
      "Turn what you learn into practical projects, working features, and real solutions.",
    icon: Blocks,
  },
  {
    key: "improve",
    number: "04",
    label: "REFINE",
    title: "Improve",
    description:
      "Review your work, learn from feedback, fix weaknesses, and keep progressing.",
    icon: RefreshCw,
  },
];

export function HowYouLearn() {
  const motionRef = useAnimationVisibility();
  const [activeStage, setActiveStage] = useState<StageKey | undefined>();

  return (
    <section
      ref={motionRef}
      className={styles.section}
      aria-labelledby="how-you-learn-title"
    >
      {/* Background atmosphere */}
      <div className={styles.backgroundGrid} aria-hidden="true" />
      <div className={styles.backgroundGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* =================================================== */}
        {/* HEADING                                             */}
        {/* =================================================== */}

        <header className={styles.heading}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>HOW YOU LEARN</span>
            <span className={styles.eyebrowLine} />
          </div>

          <h2 id="how-you-learn-title">
            From Understanding
            <span>to Real Ability.</span>
          </h2>

          <p>
            Every concept moves through a practical learning cycle — understand
            it, apply it, build with it, and improve through feedback.
          </p>
        </header>

        {/* =================================================== */}
        {/* LEARNING JOURNEY                                    */}
        {/* =================================================== */}

        <div
          className={styles.journey}
          data-active-stage={activeStage}
          onPointerLeave={() => setActiveStage(undefined)}
        >
          {/* subtle system labels */}
          <span
            className={`${styles.systemLabel} ${styles.systemLabelStart}`}
            aria-hidden="true"
          >
            LEARNING PATH / 01
          </span>

          <span
            className={`${styles.systemLabel} ${styles.systemLabelEnd}`}
            aria-hidden="true"
          >
            KNOWLEDGE → ABILITY
          </span>

          {/* Desktop path */}
          <div className={styles.desktopTrack} aria-hidden="true">
            <span className={styles.trackBase} />

            <span className={`${styles.trackSegment} ${styles.segmentOne}`} />

            <span className={`${styles.trackSegment} ${styles.segmentTwo}`} />

            <span className={`${styles.trackSegment} ${styles.segmentThree}`} />

            <span className={`${styles.flowDot} ${styles.flowDotOne}`} />

            <span className={`${styles.flowDot} ${styles.flowDotTwo}`} />
          </div>

          {/* ================================================= */}
          {/* STAGES                                            */}
          {/* ================================================= */}

          <div className={styles.stages}>
            {stages.map((stage) => {
              const Icon = stage.icon;

              return (
                <article
                  key={stage.key}
                  className={`${styles.stage} ${styles[stage.key]}`}
                  data-stage={stage.key}
                  onPointerEnter={() => setActiveStage(stage.key)}
                >
                  {/* visual station */}
                  <div className={styles.stageVisual}>
                    <div className={styles.iconAura} aria-hidden="true" />

                    <div className={styles.iconStage} aria-hidden="true">
                      <Icon size={46} strokeWidth={1.35} />
                    </div>

                    <span className={styles.stageNode} aria-hidden="true">
                      <i />
                    </span>
                  </div>

                  {/* content */}
                  <div className={styles.stageContent}>
                    <div className={styles.stageMeta}>
                      <span className={styles.stageNumber}>{stage.number}</span>

                      <span className={styles.stageLabel}>{stage.label}</span>
                    </div>

                    <h3>{stage.title}</h3>

                    <p>{stage.description}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* ================================================= */}
          {/* JOURNEY FOOTER                                    */}
          {/* ================================================= */}

          <div className={styles.journeyFooter}>
            <div className={styles.footerFlow} aria-hidden="true">
              <span>UNDERSTAND</span>
              <i />
              <span>APPLY</span>
              <i />
              <span>CREATE</span>
              <i />
              <span>REFINE</span>
            </div>

            <div className={styles.footerStatus}>
              <span className={styles.statusDot} />
              CONTINUOUS LEARNING
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
