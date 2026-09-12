 "use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { useAnimationVisibility } from "../motion/use-animation-visibility";
import {
  Award,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { usePointerMotion } from "../motion/use-pointer-motion";
import styles from "./why-ai-coding.module.css";

type Benefit = {
  title: string;
  description: string;
  icon: LucideIcon;
  position:
    | "projects"
    | "mentorship"
    | "career"
    | "workshops"
    | "certification";
};

const benefits: Benefit[] = [
  {
    title: "Real Projects",
    description: "Build practical projects instead of learning only theory.",
    icon: Code2,
    position: "projects",
  },
  {
    title: "Expert Mentorship",
    description: "Learn with guidance from experienced trainers.",
    icon: Users,
    position: "mentorship",
  },
  {
    title: "Career-Focused Learning",
    description: "Develop skills connected to real-world opportunities.",
    icon: BriefcaseBusiness,
    position: "career",
  },
  {
    title: "Workshops & Activities",
    description:
      "Learn through hands-on activities, workshops, and practical experiences.",
    icon: Wrench,
    position: "workshops",
  },
  {
    title: "Certification",
    description:
      "Complete your learning journey with a clear certification milestone.",
    icon: Award,
    position: "certification",
  },
];

const sectionStyle = {
  "--core-x": "0px",
  "--core-y": "0px",
  "--core-tilt-x": "0deg",
  "--core-tilt-y": "0deg",
  "--core-glow-x": "50%",
  "--core-glow-y": "50%",
} as CSSProperties;

const cardStyle = {
  "--mouse-x": "50%",
  "--mouse-y": "36%",
} as CSSProperties;

export function WhyAiCoding() {
  const motionRef = useAnimationVisibility();
  const [activeBenefit, setActiveBenefit] = useState<string | undefined>();

  const experiencePointer = usePointerMotion(sectionStyle, (x, y) => ({
    "--core-x": `${(x-0.5)*14}px`, "--core-y": `${(y-0.5)*12}px`,
    "--core-tilt-x": `${(0.5-y)*3.2}deg`, "--core-tilt-y": `${(x-0.5)*4.2}deg`,
    "--core-glow-x": `${x*100}%`, "--core-glow-y": `${y*100}%`,
  }));
  const cardPointer = usePointerMotion(cardStyle, (x, y) => ({ "--mouse-x": `${x * 100}%`, "--mouse-y": `${y * 100}%` }));

  return (
    <section ref={motionRef} className={styles.section} aria-labelledby="why-ai-coding-title">
      <div className={styles.sectionGrid} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.heading}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>WHY AI &amp; CODING</span>
            <span className={styles.eyebrowLine} />
          </div>

          <h2 id="why-ai-coding-title">
            More Than Learning.
            <span>Build for the Real World.</span>
          </h2>

          <p>
            Learn through practical projects, expert mentorship, workshops, and
            a structured approach designed to turn knowledge into real-world
            skills.
          </p>
        </div>

        <div
          className={styles.experience}
          data-active-benefit={activeBenefit}
          {...experiencePointer}
          onPointerLeave={(event) => {
            experiencePointer.onPointerLeave(event);
            setActiveBenefit(undefined);
          }}
          onPointerCancel={(event) => {
            experiencePointer.onPointerCancel(event);
            setActiveBenefit(undefined);
          }}
          style={sectionStyle}
        >
          <div className={styles.coreWrap} aria-hidden="true">
            <div className={`${styles.connector} ${styles.connectorOne}`} />
            <div className={`${styles.connector} ${styles.connectorTwo}`} />
            <div className={`${styles.connector} ${styles.connectorThree}`} />
            <div className={`${styles.connector} ${styles.connectorFour}`} />
            <div className={`${styles.connector} ${styles.connectorFive}`} />

            <div className={styles.aiCore}>
              <div className={`${styles.orbit} ${styles.orbitOne}`} />
              <div className={`${styles.orbit} ${styles.orbitTwo}`} />
              <div className={`${styles.orbit} ${styles.orbitThree}`} />

              <span className={`${styles.dataDot} ${styles.dotOne}`} />
              <span className={`${styles.dataDot} ${styles.dotTwo}`} />
              <span className={`${styles.dataDot} ${styles.dotThree}`} />
              <span className={`${styles.dataDot} ${styles.dotFour}`} />
              <span className={`${styles.dataDot} ${styles.dotFive}`} />

              <div className={styles.coreGlass}>
                <BrainCircuit size={46} strokeWidth={1.35} />
                <span>AI CORE</span>
              </div>
            </div>
          </div>

          <div className={styles.benefits}>
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className={`${styles.benefit} ${styles[benefit.position]}`}
                  onPointerEnter={() => setActiveBenefit(benefit.position)}
                  {...cardPointer}
                  onPointerLeave={(event) => {
                    cardPointer.onPointerLeave(event);
                    setActiveBenefit(undefined);
                  }}
                  style={cardStyle}
                >
                  <div className={styles.benefitTop}>
                    <span className={styles.benefitIcon} aria-hidden="true">
                      <Icon size={20} strokeWidth={1.65} />
                    </span>
                  </div>

                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
