"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  Code2,
  FolderKanban,
  Lightbulb,
} from "lucide-react";

import { useAnimationVisibility } from "../../motion/use-animation-visibility";
import styles from "./learning-outcomes.module.css";

type OutcomeKey = "skills" | "projects" | "problemSolving" | "career";

type Outcome = {
  key: OutcomeKey;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const outcomes: Outcome[] = [
  {
    key: "skills",
    label: "PRACTICAL SKILLS",
    title: "Build With Confidence",
    description:
      "Apply concepts through real tools, practical tasks, and hands-on development.",
    icon: Code2,
  },
  {
    key: "projects",
    label: "PROJECT EXPERIENCE",
    title: "Create Work That Matters",
    description:
      "Build meaningful projects and working features that show what you can do.",
    icon: FolderKanban,
  },
  {
    key: "problemSolving",
    label: "PROBLEM SOLVING",
    title: "Think Through Challenges",
    description:
      "Practice debugging, reasoning, and finding better solutions to technical problems.",
    icon: Lightbulb,
  },
  {
    key: "career",
    label: "CAREER READINESS",
    title: "Move Forward With Direction",
    description:
      "Build familiarity with professional tools, workflows, and real-world expectations.",
    icon: BriefcaseBusiness,
  },
];

function OutcomeItem({ outcome }: { outcome: Outcome }) {
  const Icon = outcome.icon;

  return (
    <article className={`${styles.outcomeItem} ${styles[outcome.key]}`}>
      <div className={styles.outcomeTop}>
        <div className={styles.outcomeIcon} aria-hidden="true">
          <Icon size={26} strokeWidth={1.8} />
        </div>

        <span className={styles.outcomeLabel}>{outcome.label}</span>
      </div>

      <div className={styles.outcomeContent}>
        <h3>{outcome.title}</h3>

        <p>{outcome.description}</p>
      </div>
    </article>
  );
}

export function LearningOutcomes() {
  const motionRef = useAnimationVisibility();

  const skills = outcomes.find((outcome) => outcome.key === "skills")!;

  const projects = outcomes.find((outcome) => outcome.key === "projects")!;

  const problemSolving = outcomes.find(
    (outcome) => outcome.key === "problemSolving",
  )!;

  const career = outcomes.find((outcome) => outcome.key === "career")!;

  return (
    <section
      ref={motionRef}
      className={styles.section}
      aria-labelledby="learning-outcomes-title"
    >
      <div className={styles.backgroundGrid} aria-hidden="true" />

      <div className={styles.backgroundGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* ================================================= */}
        {/* HEADING                                           */}
        {/* ================================================= */}

        <header className={styles.heading}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>LEARNING OUTCOMES</span>
            <span className={styles.eyebrowLine} />
          </div>

          <h2 id="learning-outcomes-title">
            Build More Than Knowledge.
            <span>Leave With Real Capability.</span>
          </h2>

          <p>
            Turn what you learn into practical skills, meaningful project
            experience, stronger problem-solving ability, and clearer career
            readiness.
          </p>
        </header>

        {/* ================================================= */}
        {/* CAPABILITY STAGE                                  */}
        {/* ================================================= */}

        <div className={styles.outcomesStage}>
          {/* Central visual comes first in DOM so tablet/mobile
              naturally place it before the outcome content. */}

          <div className={styles.visualSlot}>
            <div className={styles.visual}>
              <div className={styles.visualAmbient} aria-hidden="true" />

              <Image
                src="/images/why-us/learning-outcomes/learning-outcomes.png"
                alt="3D development workspace representing practical coding skills, project experience, problem solving, and career readiness"
                width={1536}
                height={1024}
                className={styles.outcomeImage}
                sizes="
                  (max-width: 480px) 92vw,
                  (max-width: 767px) 90vw,
                  (max-width: 1023px) 76vw,
                  (max-width: 1439px) 680px,
                  780px
                "
              />
            </div>
          </div>

          <div className={styles.skillsSlot}>
            <OutcomeItem outcome={skills} />
          </div>

          <div className={styles.projectsSlot}>
            <OutcomeItem outcome={projects} />
          </div>

          <div className={styles.problemSolvingSlot}>
            <OutcomeItem outcome={problemSolving} />
          </div>

          <div className={styles.careerSlot}>
            <OutcomeItem outcome={career} />
          </div>
        </div>
      </div>
    </section>
  );
}
