"use client";

import Image from "next/image";
import { InstitutionForm } from "../institution-form/institution-form";
import { LearnerForm } from "../learner-form/learner-form";
import { useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Lightbulb,
  Presentation,
  Rocket,
  School2,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";

import styles from "./enquiry-form-section.module.css";

type EnquiryType = "learner" | "institution";

const learnerPoints = [
  {
    icon: BrainCircuit,
    title: "Clear Learning Direction",
    text: "Understand what to learn first and which program fits your current stage.",
    tone: "blue",
  },
  {
    icon: Code2,
    title: "Practical Skill Building",
    text: "Focus on useful tools, projects, and implementation instead of only theory.",
    tone: "violet",
  },
  {
    icon: Rocket,
    title: "Career-Focused Progress",
    text: "Connect your learning with stronger projects, capability, and future opportunities.",
    tone: "teal",
  },
] as const;

const institutionPoints = [
  {
    icon: Lightbulb,
    title: "Career Awareness",
    text: "Help students understand how AI, coding, and technology careers are evolving.",
    tone: "orange",
  },
  {
    icon: Presentation,
    title: "Practical Exposure",
    text: "Introduce real-world technology through awareness sessions, workshops, and discussion.",
    tone: "violet",
  },
  {
    icon: Target,
    title: "Future Direction",
    text: "Help students see what they can explore, learn, and build toward next.",
    tone: "cyan",
  },
] as const;

const enquiryContent = {
  learner: {
    eyebrow: "LEARNER ENQUIRY",
    title: "Your Goals Deserve a",
    highlight: "Clear Learning Path.",
    description:
      "Tell us where you are today and what you want to achieve. We’ll help you understand which program fits, where to begin, and what your next practical step can be.",
    image: "/images/enquiry/learner-enquiry.png",
    imageAlt:
      "Learner exploring AI and coding through practical projects and career-focused learning",
    points: learnerPoints,
    badge: "LEARN • BUILD • GROW",
  },
  institution: {
    eyebrow: "INSTITUTION ENQUIRY",
    title: "Bring Future-Focused",
    highlight: "Technology Awareness to Students.",
    description:
      "Invite AI & Coding to help students understand how AI, coding, and emerging technologies are shaping careers through awareness, practical exposure, workshops, and meaningful discussion.",
    image: "/images/enquiry/institution-enquiry.png",
    imageAlt:
      "Students attending an AI and coding awareness session in a modern educational environment",
    points: institutionPoints,
    badge: "AWARENESS • EXPOSURE • DIRECTION",
  },
} as const;

export function EnquiryFormSection() {
  const [type, setType] = useState<EnquiryType>("learner");
  const active = enquiryContent[type];

  return (
    <section
      className={`${styles.section} ${
        type === "learner" ? styles.learnerTheme : styles.institutionTheme
      }`}
      aria-labelledby="enquiry-form-title"
    >
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.shell}>
        <div
          className={styles.selector}
          role="tablist"
          aria-label="Choose enquiry type"
        >
          <button
            type="button"
            role="tab"
            aria-selected={type === "learner"}
            className={`${styles.selectorButton} ${
              type === "learner" ? styles.selectorActive : ""
            }`}
            onClick={() => setType("learner")}
          >
            <span
              className={`${styles.selectorIcon} ${styles.learnerSelectorIcon}`}
              aria-hidden="true"
            >
              <UserRound size={20} strokeWidth={1.9} />
            </span>

            <span className={styles.selectorCopy}>
              <small>FOR INDIVIDUALS</small>
              <strong>Learner Enquiry</strong>
              <span>Students, graduates, and individual learners</span>
            </span>

            <ArrowRight
              className={styles.selectorArrow}
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={type === "institution"}
            className={`${styles.selectorButton} ${
              type === "institution" ? styles.selectorActive : ""
            }`}
            onClick={() => setType("institution")}
          >
            <span
              className={`${styles.selectorIcon} ${styles.institutionSelectorIcon}`}
              aria-hidden="true"
            >
              <School2 size={20} strokeWidth={1.9} />
            </span>

            <span className={styles.selectorCopy}>
              <small>FOR EDUCATION PARTNERS</small>
              <strong>Institution Enquiry</strong>
              <span>Schools, colleges, and learning institutes</span>
            </span>

            <ArrowRight
              className={styles.selectorArrow}
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className={styles.showcase} key={type}>
          <div className={styles.visualColumn}>
            <div className={styles.imageFrame}>
              <div className={styles.imageGlow} aria-hidden="true" />

              <Image
                src={active.image}
                alt={active.imageAlt}
                fill
                priority={type === "learner"}
                sizes="(max-width: 700px) 100vw, (max-width: 1023px) 80vw, 46vw"
                className={styles.image}
              />
            </div>

            <div className={styles.visualBadge}>
              {type === "learner" ? (
                <GraduationCap size={17} strokeWidth={1.9} />
              ) : (
                <BriefcaseBusiness size={17} strokeWidth={1.9} />
              )}

              <span>{active.badge}</span>
            </div>
          </div>

          <div className={styles.contentColumn}>
            <div className={styles.eyebrow}>
              <Sparkles size={13} strokeWidth={2} aria-hidden="true" />
              <span>{active.eyebrow}</span>
            </div>

            <h2 id="enquiry-form-title">
              {active.title}
              <span>{active.highlight}</span>
            </h2>

            <p className={styles.description}>{active.description}</p>

            <div className={styles.points}>
              {active.points.map(({ icon: Icon, title, text, tone }) => {
                const toneClass =
                  tone === "blue"
                    ? styles.toneBlue
                    : tone === "violet"
                      ? styles.toneViolet
                      : tone === "teal"
                        ? styles.toneTeal
                        : tone === "orange"
                          ? styles.toneOrange
                          : styles.toneCyan;

                return (
                  <article
                    className={`${styles.point} ${toneClass}`}
                    key={title}
                  >
                    <span className={styles.pointIcon} aria-hidden="true">
                      <Icon size={19} strokeWidth={1.9} />
                    </span>

                    <div>
                      <strong>{title}</strong>
                      <p>{text}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className={styles.nextHint}>
              <span>
                {type === "learner"
                  ? "Next, tell us about your learning goals."
                  : "Next, tell us about your institution and students."}
              </span>

              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className={styles.formSlot}>
          {type === "learner" ? <LearnerForm /> : <InstitutionForm />}
        </div>
      </div>
    </section>
  );
}
