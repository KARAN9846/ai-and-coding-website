"use client";

import { useSyncExternalStore, type CSSProperties, type MouseEvent } from "react";
import Image, { type StaticImageData } from "next/image";
import { useTheme } from "next-themes";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Braces,
  Cpu,
  Database,
  Smartphone,
} from "lucide-react";

import foundationProgrammingImage from "@/public/images/courses/f2p/foundation-programming.png";
import databaseManagementImage from "@/public/images/courses/f2p/database-management.png";
import enterpriseJavaImage from "@/public/images/courses/f2p/enterprise-java-development.png";
import mobileProgrammingImage from "@/public/images/courses/f2p/mobile-based-programming.png";
import fullStackDark from "@/public/images/courses/f2p/specialization-full-stack-dark.png";
import fullStackLight from "@/public/images/courses/f2p/specialization-full-stack-light.png";
import aiDataRoboticsDark from "@/public/images/courses/f2p/specialization-ai-data-robotics-dark.png";
import aiDataRoboticsLight from "@/public/images/courses/f2p/specialization-ai-data-robotics-light.png";
import gameDevelopmentDark from "@/public/images/courses/f2p/specialization-game-development-dark.png";
import gameDevelopmentLight from "@/public/images/courses/f2p/specialization-game-development-light.png";

import styles from "./f2p-journey.module.css";

type Level = {
  level: string;
  title: string;
  description: string;
  technologies: string[];
  icon: LucideIcon;
  visualClassName: string;
  image?: {
    src: StaticImageData;
    alt: string;
  };
};

type Specialization = {
  label: "A" | "B" | "C";
  title: string;
  description: string;
  technologies: string[];
  images: Record<"light" | "dark", StaticImageData>;
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
      src: foundationProgrammingImage,
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
      src: databaseManagementImage,
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
    image: {
      src: enterpriseJavaImage,
      alt: "Enterprise Java development visual",
    },
  },
  {
    level: "LEVEL 4",
    title: "Mobile Based Programming",
    description:
      "Focus on mobile application development across Android, Firebase, and iOS.",
    technologies: ["Android", "Firebase", "iOS"],
    icon: Smartphone,
    visualClassName: styles.mobileVisual,
    image: {
      src: mobileProgrammingImage,
      alt: "Mobile programming visual for Android, Firebase, and iOS",
    },
  },
];

const specializations: Specialization[] = [
  {
    label: "A",
    title: "Full Stack Development",
    description:
      "Build across the application stack with modern frontend and backend tools.",
    technologies: ["MongoDB", "Express", "React", "Node"],
    images: { light: fullStackLight, dark: fullStackDark },
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
    images: { light: aiDataRoboticsLight, dark: aiDataRoboticsDark },
  },
  {
    label: "C",
    title: "Game Development",
    description:
      "Create interactive experiences through focused game development.",
    technologies: ["Unity"],
    images: { light: gameDevelopmentLight, dark: gameDevelopmentDark },
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
          quality={90}
          className={styles.levelImage}
          sizes="(max-width: 768px) min(414px, calc(100vw - 72px)), (max-width: 1024px) 41vw, 460px"
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

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function F2PJourney() {
  const { resolvedTheme } = useTheme();
  // The server and first client render agree on dark artwork before theme resolution.
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    clientSnapshot,
    serverSnapshot,
  );
  const posterTheme = hydrated && resolvedTheme === "light" ? "light" : "dark";

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

        <article className={styles.specialization}>
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
                aria-labelledby={`specialization-${specialization.label}-title`}
              >
                <Image
                  src={specialization.images[posterTheme]}
                  alt=""
                  aria-hidden="true"
                  fill
                  quality={90}
                  loading="lazy"
                  sizes="(max-width: 768px) min(580px, calc(100vw - 72px)), (max-width: 1024px) calc((100vw - 48px) / 3 - 12px), (max-width: 1184px) calc((100vw - 64px) / 3 - 18px), 356px"
                  className={styles.specializationPoster}
                />
                <div className={styles.screenReaderOnly}>
                  <span>{specialization.label}</span>
                  <h4 id={`specialization-${specialization.label}-title`}>
                    {specialization.title}
                  </h4>
                  <p>{specialization.description}</p>
                  <ul aria-label="Technologies">
                    {specialization.technologies.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
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
