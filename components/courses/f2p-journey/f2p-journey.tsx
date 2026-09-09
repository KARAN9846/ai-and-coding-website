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
  Smartphone,
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
    visualClassName: styles.aiVisual,
  },
  {
    label: "C",
    title: "Game Development",
    description:
      "Create interactive experiences through focused game development.",
    technologies: ["Unity"],
    icon: Gamepad2,
    visualClassName: styles.gameVisual,
  },
];

const baseInteractiveStyle = {
  "--mouse-x": "50%",
  "--mouse-y": "44%",
  "--stage-x": "0px",
  "--stage-y": "0px",
} as CSSProperties;

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
          sizes="(max-width: 768px) min(380px, calc(100vw - 68px)), (max-width: 1024px) 40vw, 420px"
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
          {levels.map((level, index) => (
            <article
              className={`${styles.levelBlock} ${
                index % 2 === 1 ? styles.levelReverse : ""
              }`}
              key={level.level}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
              style={baseInteractiveStyle}
            >
              <StageRoute />
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
          style={baseInteractiveStyle}
        >
          <div className={styles.specializationHeader}>
            <div
              className={`${styles.milestone} ${styles.finalMilestone}`}
              aria-hidden="true"
            >
              <span />
            </div>
            <span className={styles.levelLabel}>LEVEL 5</span>
            <h3>Choose Your Specialization</h3>
            <p>
              Choose a direction and continue building your technical expertise.
            </p>
          </div>

          <svg
            className={styles.branchMap}
            viewBox="0 0 900 80"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              className={styles.branchLine}
              d="M450 0 C450 42 150 26 150 80"
            />
            <path
              className={styles.branchLine}
              d="M450 0 L450 80"
            />
            <path
              className={styles.branchLine}
              d="M450 0 C450 42 750 26 750 80"
            />
            <circle className={styles.branchJunction} cx="450" cy="4" r="4" />
          </svg>

          <div className={styles.specializationGrid}>
            {specializations.map((specialization) => (
              <article
                className={styles.specializationPanel}
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
        </article>
      </div>
    </section>
  );
}

// Each segment shares endpoints with its neighbors, even when a stage grows.
function StageRoute() {
  const curve = "M500 0 C500 60 580 105 500 160 C420 215 500 260 500 320";

  return (
    <>
      <svg
        className={styles.journeyPath}
        viewBox="0 0 1000 320"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path className={styles.pathGlow} d={curve} />
        <path className={styles.pathBase} d={curve} />
        <path className={styles.pathPulse} d={curve} />
        <path
          className={styles.connector}
          d="M500 160 C463 160 463 128 418 128 M500 160 C537 160 537 192 582 192"
        />
      </svg>
      <svg
        className={styles.mobilePath}
        viewBox="0 0 32 320"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className={styles.pathBase}
          d="M12 0 V80 C12 140 24 180 12 240 V320"
        />
      </svg>
    </>
  );
}
