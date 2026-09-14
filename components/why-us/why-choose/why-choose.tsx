"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  BriefcaseBusiness,
  ChevronRight,
  Code2,
  Users,
  Wrench,
} from "lucide-react";

import { useAnimationVisibility } from "../../motion/use-animation-visibility";
import styles from "./why-choose.module.css";

type FeatureKey =
  | "projects"
  | "mentorship"
  | "career"
  | "workshops"
  | "certification";

type Feature = {
  key: FeatureKey;
  number: string;
  label: string;
  title: string;
  compactTitle: string;
  description: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  visualLabel: string;
};

const features: Feature[] = [
  {
    key: "projects",
    number: "01",
    label: "PROJECT-BASED",
    title: "Real Projects",
    compactTitle: "Projects",
    description:
      "Turn concepts into practical work by building projects that reflect how technology is actually used.",
    icon: Code2,
    image: "/images/why-us/learning-studio/real-projects.png",
    imageAlt:
      "3D illustration representing practical coding and software project development",
    visualLabel: "BUILD • APPLY • COMPLETE",
  },
  {
    key: "mentorship",
    number: "02",
    label: "GUIDED LEARNING",
    title: "Expert Mentorship",
    compactTitle: "Mentorship",
    description:
      "Learn with trainer guidance, useful feedback, and support while you practice, build, and improve.",
    icon: Users,
    image: "/images/why-us/learning-studio/expert-mentorship.png",
    imageAlt:
      "3D illustration representing expert mentorship, guidance, and project feedback",
    visualLabel: "GUIDANCE • FEEDBACK • GROWTH",
  },
  {
    key: "career",
    number: "03",
    label: "CAREER-FOCUSED",
    title: "Skills With Direction",
    compactTitle: "Career",
    description:
      "Build practical abilities around projects, tools, and learning paths connected to real opportunities.",
    icon: BriefcaseBusiness,
    image: "/images/why-us/learning-studio/career-focused-learning.png",
    imageAlt:
      "3D illustration representing skill development, projects, and career readiness",
    visualLabel: "SKILLS • PROJECTS • READINESS",
  },
  {
    key: "workshops",
    number: "04",
    label: "HANDS-ON",
    title: "Workshops & Activities",
    compactTitle: "Workshops",
    description:
      "Go beyond lectures through practical sessions, challenges, collaborative activities, and guided building.",
    icon: Wrench,
    image: "/images/why-us/learning-studio/workshops-activities.png",
    imageAlt:
      "3D illustration representing hands-on coding workshops and practical activities",
    visualLabel: "PRACTICE • BUILD • REVIEW",
  },
  {
    key: "certification",
    number: "05",
    label: "MILESTONE",
    title: "Certification",
    compactTitle: "Certificate",
    description:
      "Complete your learning journey with a clear milestone that recognizes your progress and effort.",
    icon: Award,
    image: "/images/why-us/learning-studio/certification.png",
    imageAlt:
      "3D illustration representing certification, achievement, and learning completion",
    visualLabel: "PROGRESS • COMPLETE • ACHIEVE",
  },
];

export function WhyChoose() {
  const motionRef = useAnimationVisibility();
  const compactSelectorRef = useRef<HTMLDivElement>(null);
  const selectorInteractedRef = useRef(false);

  const [activeFeature, setActiveFeature] = useState<FeatureKey>("projects");
  const [canScrollForward, setCanScrollForward] = useState(false);

  useEffect(() => {
    const selector = compactSelectorRef.current;

    if (!selector) {
      return;
    }

    const updateScrollHint = () => {
      const remaining =
        selector.scrollWidth - selector.clientWidth - selector.scrollLeft;

      setCanScrollForward(remaining > 8);
    };

    updateScrollHint();

    selector.addEventListener("scroll", updateScrollHint, { passive: true });
    window.addEventListener("resize", updateScrollHint);

    return () => {
      selector.removeEventListener("scroll", updateScrollHint);
      window.removeEventListener("resize", updateScrollHint);
    };
  }, []);

  useEffect(() => {
    const selector = compactSelectorRef.current;

    if (!selector || typeof window === "undefined") {
      return;
    }

    const isCompact = window.matchMedia("(max-width: 1023px)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!isCompact || prefersReducedMotion) {
      return;
    }

    const storageKey = "learning-studio-selector-hint-seen";

    try {
      if (window.sessionStorage.getItem(storageKey)) {
        return;
      }
    } catch {
      // Storage can be unavailable in stricter privacy modes.
    }

    let returnTimer: number | undefined;

    const hintTimer = window.setTimeout(() => {
      if (selectorInteractedRef.current) {
        return;
      }

      const maxScroll = selector.scrollWidth - selector.clientWidth;

      if (maxScroll <= 12) {
        return;
      }

      try {
        window.sessionStorage.setItem(storageKey, "true");
      } catch {
        // The visual hint should still work even when storage is blocked.
      }

      selector.scrollTo({
        left: Math.min(14, maxScroll),
        behavior: "smooth",
      });

      returnTimer = window.setTimeout(() => {
        if (!selectorInteractedRef.current) {
          selector.scrollTo({ left: 0, behavior: "smooth" });
        }
      }, 420);
    }, 700);

    return () => {
      window.clearTimeout(hintTimer);

      if (returnTimer) {
        window.clearTimeout(returnTimer);
      }
    };
  }, []);

  const scrollSelectorForward = () => {
    const selector = compactSelectorRef.current;

    if (!selector) {
      return;
    }

    selectorInteractedRef.current = true;

    selector.scrollBy({
      left: Math.max(selector.clientWidth * 0.62, 120),
      behavior: "smooth",
    });
  };

  const active =
    features.find((feature) => feature.key === activeFeature) ?? features[0];

  const ActiveIcon = active.icon;

  return (
    <section
      ref={motionRef}
      className={styles.section}
      aria-labelledby="why-choose-title"
    >
      <div className={styles.backgroundGrid} aria-hidden="true" />
      <div className={styles.backgroundGlow} aria-hidden="true" />

      <div className={styles.container}>
        <header className={styles.heading}>
          <div className={styles.eyebrow}>
            <span />
            WHY CHOOSE AI &amp; CODING
            <span />
          </div>

          <h2 id="why-choose-title">
            Built Around How
            <span>You Actually Learn.</span>
          </h2>

          <p>
            A practical learning environment where guidance, projects,
            activities, and clear progress come together to help you build
            skills with confidence.
          </p>
        </header>

        <div className={styles.studio}>
          <div className={styles.studioHeader}>
            <div className={styles.studioIdentity}>
              <span className={styles.studioMark}>
                <Code2 size={18} strokeWidth={1.6} />
              </span>

              <div>
                <small>AI &amp; CODING</small>
                <strong>LEARNING STUDIO</strong>
              </div>
            </div>

            <div className={styles.studioStatus}>
              <span />
              LEARNING SYSTEM ACTIVE
            </div>
          </div>

          <div className={styles.studioBody}>
            {/* Desktop / laptop side rail */}
            <div className={styles.featureRail}>
              <div className={styles.railIntro}>
                <span>THE EXPERIENCE</span>
                <strong>What makes learning different here.</strong>
              </div>

              <div className={styles.featureList}>
                {features.map((feature) => {
                  const Icon = feature.icon;
                  const isActive = activeFeature === feature.key;

                  return (
                    <button
                      key={feature.key}
                      type="button"
                      data-feature={feature.key}
                      className={`${styles.featureButton} ${
                        isActive ? styles.featureButtonActive : ""
                      }`}
                      aria-pressed={isActive}
                      aria-controls="learning-studio-stage"
                      onClick={() => setActiveFeature(feature.key)}
                      onPointerEnter={() => setActiveFeature(feature.key)}
                    >
                      <span className={styles.featureNumber}>
                        {feature.number}
                      </span>

                      <span className={styles.featureIcon} aria-hidden="true">
                        <Icon size={29} strokeWidth={1.65} />
                      </span>

                      <span className={styles.featureButtonText}>
                        <small>{feature.label}</small>
                        <strong>{feature.title}</strong>
                      </span>

                      <ChevronRight
                        className={styles.featureArrow}
                        size={18}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tablet / mobile intro */}
            <div className={styles.compactIntro}>
              <span>THE EXPERIENCE</span>
              <strong>What makes learning different here.</strong>
            </div>

            {/* Tablet / mobile horizontal selector. It stays reachable while the stage scrolls. */}
            <div
              className={styles.compactSelectorShell}
              data-can-scroll={canScrollForward ? "true" : "false"}
            >
              <div
                ref={compactSelectorRef}
                className={styles.compactSelector}
                role="tablist"
                aria-label="Learning Studio experiences"
                onPointerDown={() => {
                  selectorInteractedRef.current = true;
                }}
              >
                {features.map((feature) => {
                  const Icon = feature.icon;
                  const isActive = activeFeature === feature.key;

                  return (
                    <button
                      key={feature.key}
                      type="button"
                      role="tab"
                      data-feature={feature.key}
                      className={`${styles.compactFeatureButton} ${
                        isActive ? styles.compactFeatureButtonActive : ""
                      }`}
                      aria-selected={isActive}
                      aria-controls="learning-studio-stage"
                      onClick={(event) => {
                        selectorInteractedRef.current = true;
                        setActiveFeature(feature.key);

                        event.currentTarget.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                          inline: "center",
                        });
                      }}
                    >
                      <span
                        className={styles.compactFeatureIcon}
                        aria-hidden="true"
                      >
                        <Icon size={25} strokeWidth={1.7} />
                      </span>

                      <span className={styles.compactFeatureCopy}>
                        <small>{feature.number}</small>
                        <strong>{feature.compactTitle}</strong>
                      </span>
                    </button>
                  );
                })}
              </div>

              {canScrollForward && (
                <button
                  type="button"
                  className={styles.selectorScrollHint}
                  onClick={scrollSelectorForward}
                  aria-label="Show more learning experiences"
                >
                  <ChevronRight
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>

            <div
              id="learning-studio-stage"
              className={styles.stage}
              data-feature={activeFeature}
              role="tabpanel"
              aria-live="polite"
            >
              <div className={styles.stageTop}>
                <div>
                  <span className={styles.stageIcon} aria-hidden="true">
                    <ActiveIcon size={34} strokeWidth={1.55} />
                  </span>

                  <div>
                    <small>{active.label}</small>
                    <h3>{active.title}</h3>
                  </div>
                </div>

                <span className={styles.stageIndex}>{active.number} / 05</span>
              </div>

              <p className={styles.stageDescription}>{active.description}</p>

              <div key={activeFeature} className={styles.visualStage}>
                <div className={styles.artworkGlow} aria-hidden="true" />

                <div className={styles.artworkFrame}>
                  <Image
                    src={active.image}
                    alt={active.imageAlt}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1023px) 86vw, 58vw"
                    className={styles.artworkImage}
                    priority={activeFeature === "projects"}
                  />
                </div>

                <div className={styles.visualMeta} aria-hidden="true">
                  <span>{active.number}</span>
                  <i />
                  <strong>{active.visualLabel}</strong>
                </div>
              </div>

              <div className={styles.stageFooter}>
                <span>
                  <i />
                  PRACTICAL LEARNING
                </span>

                <span>
                  <i />
                  GUIDED PROGRESS
                </span>

                <span>
                  <i />
                  REAL APPLICATION
                </span>
              </div>
            </div>
          </div>

          <div className={styles.studioFooter}>
            <div>
              <span>LEARN</span>
              <i />
              <span>PRACTICE</span>
              <i />
              <span>BUILD</span>
              <i />
              <span>IMPROVE</span>
              <i />
              <span>GROW</span>
            </div>

            <small>LEARNING EXPERIENCE / 01</small>
          </div>
        </div>
      </div>
    </section>
  );
}
