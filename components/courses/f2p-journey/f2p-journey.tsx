"use client";

import type { CSSProperties, MouseEvent } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Bot,
  Braces,
  Cpu,
  Database,
  Gamepad2,
  Layers3,
  Network,
  Smartphone,
  Sparkles,
} from "lucide-react";

import styles from "./f2p-journey.module.css";

type Level = {
  level: string;
  title: string;
  description: string;
  technologies: string[];
  icon: LucideIcon;
  visualClassName: string;
  image?: {
    src: string;
    alt: string;
  };
};

type Specialization = {
  label: "A" | "B" | "C";
  title: string;
  description: string;
  technologies: string[];
  icon: LucideIcon;
  panelClassName: string;
  visualClassName: string;
};

const levels: Level[] = [
  {
    level: "LEVEL 1",
    title: "Foundation Programming",
    description:
      "Focus on programming foundations, logic, web basics, and core programming concepts.",
    technologies: [
      "C",
      "C++",
      "HTML",
      "CSS",
      "JavaScript",
      "Java",
      "Python",
      "SQL",
      "Data Structure",
    ],
    icon: Braces,
    visualClassName: styles.foundationVisual,
    image: {
      src: "/images/courses/f2p/foundation-programming.png",
      alt: "Foundation programming visual",
    },
  },
  {
    level: "LEVEL 2",
    title: "Database Management",
    description:
      "Focus on databases, SQL, structured data, and advanced database skills.",
    technologies: ["Tableau", "SQL", "Database", "Advanced SQL"],
    icon: Database,
    visualClassName: styles.databaseVisual,
    image: {
      src: "/images/courses/f2p/database-management.png",
      alt: "Database management visual",
    },
  },
  {
    level: "LEVEL 3",
    title: "Enterprise Java Development",
    description:
      "Focus on enterprise Java development and professional Java frameworks.",
    technologies: ["Advanced Java", "Spring Framework", "Core", "Boot", "MVC"],
    icon: Cpu,
    visualClassName: styles.enterpriseVisual,
  },
  {
    level: "LEVEL 4",
    title: "Mobile Based Programming",
    description:
      "Focus on mobile application development across Android, Firebase, and iOS.",
    technologies: ["Android", "Firebase", "iOS"],
    icon: Smartphone,
    visualClassName: styles.mobileVisual,
  },
];

const specializations: Specialization[] = [
  {
    label: "A",
    title: "Full Stack Development",
    description:
      "Build across the application stack with modern frontend and backend tools.",
    technologies: ["MongoDB", "Express", "React", "Node"],
    icon: Layers3,
    panelClassName: styles.fullStackPanel,
    visualClassName: styles.fullStackVisual,
  },
  {
    label: "B",
    title: "AI, Data Science & Robotics",
    description:
      "Explore intelligent systems, data, machine learning, and creative AI tools.",
    technologies: [
      "Python",
      "AI",
      "ChatGPT",
      "DALL\u00b7E",
      "Robotics",
      "Machine Learning",
      "Deep Learning",
    ],
    icon: Bot,
    panelClassName: styles.aiPanel,
    visualClassName: styles.aiVisual,
  },
  {
    label: "C",
    title: "Game Development",
    description:
      "Create interactive experiences through focused game development.",
    technologies: ["Unity"],
    icon: Gamepad2,
    panelClassName: styles.gamePanel,
    visualClassName: styles.gameVisual,
  },
];

const baseInteractiveStyle = {
  "--mouse-x": "50%",
  "--mouse-y": "44%",
  "--stage-x": "0px",
  "--stage-y": "0px",
} as CSSProperties;

function getInteractiveStyle(index: number) {
  return {
    ...baseInteractiveStyle,
    "--reveal-delay": `${index * 90}ms`,
  } as CSSProperties;
}

function handleMove(event: MouseEvent<HTMLElement>) {
  if (
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  target.style.setProperty("--mouse-x", `${(x * 100).toFixed(2)}%`);
  target.style.setProperty("--mouse-y", `${(y * 100).toFixed(2)}%`);
  target.style.setProperty("--stage-x", `${((x - 0.5) * 10).toFixed(2)}px`);
  target.style.setProperty("--stage-y", `${((y - 0.5) * 8).toFixed(2)}px`);
}

function handleLeave(event: MouseEvent<HTMLElement>) {
  const target = event.currentTarget;

  target.style.setProperty("--mouse-x", "50%");
  target.style.setProperty("--mouse-y", "44%");
  target.style.setProperty("--stage-x", "0px");
  target.style.setProperty("--stage-y", "0px");
}

function LevelVisual({ level }: { level: Level }) {
  const Icon = level.icon;
  const hasImage = Boolean(level.image);

  return (
    <div
      className={`${styles.visualStage} ${level.visualClassName} ${
        hasImage ? styles.imageStage : ""
      }`}
      aria-hidden={hasImage ? undefined : true}
    >
      {level.image ? (
        <Image
          src={level.image.src}
          alt={level.image.alt}
          fill
          className={styles.levelImage}
          sizes="(max-width: 760px) calc(100vw - 82px), (max-width: 1020px) 380px, 440px"
        />
      ) : (
        <>
          <span className={styles.stageGlow} />
          <span className={styles.stageGrid} />
          <span className={styles.stageRing} />
          <span className={styles.stageRingSoft} />
          <span className={styles.stagePanel} />
          <span className={styles.stageCore}>
            <Icon size={30} strokeWidth={1.55} />
          </span>
          <span className={`${styles.stageNode} ${styles.stageNodeOne}`} />
          <span className={`${styles.stageNode} ${styles.stageNodeTwo}`} />
          <span className={`${styles.stageNode} ${styles.stageNodeThree}`} />
          <span className={styles.stageLabel}>LEVEL VISUAL</span>
        </>
      )}
    </div>
  );
}

function SpecializationVisual({
  specialization,
}: {
  specialization: Specialization;
}) {
  const Icon = specialization.icon;

  return (
    <div
      className={`${styles.specialVisual} ${specialization.visualClassName}`}
      aria-hidden="true"
    >
      <span className={styles.specialOrbit} />
      <span className={styles.specialOrbitSoft} />
      <span className={styles.specialCore}>
        <Icon size={24} strokeWidth={1.65} />
      </span>
      <span className={`${styles.specialDot} ${styles.specialDotOne}`} />
      <span className={`${styles.specialDot} ${styles.specialDotTwo}`} />
      <span className={styles.specialLabel}>VISUAL</span>
    </div>
  );
}

export function F2PJourney() {
  return (
    <section
      id="f2p-journey"
      className={styles.section}
      aria-labelledby="f2p-journey-title"
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>F2P PROGRAM</span>
            <span className={styles.eyebrowLine} />
          </div>

          <h2 id="f2p-journey-title">From Foundation to Professional.</h2>

          <p>
            A structured learning journey that takes you from programming
            fundamentals through databases, enterprise development, mobile
            technologies, and your chosen specialization.
          </p>
        </div>

        <div className={styles.journey}>
          <svg
            className={styles.journeyPath}
            viewBox="0 0 120 1120"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              className={styles.pathBase}
              d="M60 38 C96 154 20 272 60 386 S96 620 60 754 S24 974 60 1082"
            />
            <path
              className={styles.pathPulse}
              d="M60 38 C96 154 20 272 60 386 S96 620 60 754 S24 974 60 1082"
            />
          </svg>

          {levels.map((level, index) => (
            <article
              className={`${styles.levelBlock} ${
                index % 2 === 1 ? styles.levelReverse : ""
              }`}
              key={level.level}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
              style={getInteractiveStyle(index)}
            >
              <div className={styles.levelContent}>
                <span className={styles.levelLabel}>{level.level}</span>
                <h3>{level.title}</h3>
                <p>{level.description}</p>

                <div className={styles.techGroup} aria-label="Technologies">
                  {level.technologies.map((technology) => (
                    <span className={styles.techChip} key={technology}>
                      {technology}
                    </span>
                  ))}
                </div>

                <a href="#enquiry" className={styles.levelLink}>
                  <span>Explore Level</span>
                  <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
                </a>
              </div>

              <div className={styles.milestone} aria-hidden="true">
                <span />
              </div>

              <LevelVisual level={level} />
            </article>
          ))}
        </div>

        <article
          className={styles.specialization}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={getInteractiveStyle(levels.length)}
        >
          <div className={styles.specializationGlow} aria-hidden="true" />

          <div className={styles.specializationHeader}>
            <span className={styles.levelLabel}>LEVEL 5</span>
            <h3>Choose Your Specialization</h3>
            <p>
              Choose a direction and continue building your technical expertise.
            </p>
          </div>

          <svg
            className={styles.branchMap}
            viewBox="0 0 900 210"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              className={styles.branchLine}
              d="M450 18 C320 70 220 86 150 142"
            />
            <path
              className={styles.branchLine}
              d="M450 18 C450 76 450 96 450 142"
            />
            <path
              className={styles.branchLine}
              d="M450 18 C580 70 680 86 750 142"
            />
          </svg>

          <div className={styles.specializationGrid}>
            {specializations.map((specialization) => (
              <article
                className={`${styles.specializationPanel} ${specialization.panelClassName}`}
                key={specialization.label}
              >
                <div className={styles.specialPanelTop}>
                  <span className={styles.specialLetter}>
                    {specialization.label}
                  </span>
                  <SpecializationVisual specialization={specialization} />
                </div>

                <h4>{specialization.title}</h4>
                <p>{specialization.description}</p>

                <div className={styles.techGroup} aria-label="Technologies">
                  {specialization.technologies.map((technology) => (
                    <span className={styles.techChip} key={technology}>
                      {technology}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <a href="#enquiry" className={styles.specializationCta}>
            <span>Discuss Your Path</span>
            <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
          </a>

          <Sparkles
            className={styles.specialSpark}
            size={20}
            aria-hidden="true"
          />
          <Network
            className={styles.specialNetwork}
            size={22}
            aria-hidden="true"
          />
        </article>
      </div>
    </section>
  );
}
