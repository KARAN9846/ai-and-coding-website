"use client";

import Image from "next/image";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CircleHelp,
  MessageCircleCheck,
  MessagesSquare,
  Route,
} from "lucide-react";

import { useAnimationVisibility } from "../../motion/use-animation-visibility";
import styles from "./learning-support.module.css";

type SupportKey = "guidance" | "clarity" | "feedback" | "direction";

type SupportItem = {
  key: SupportKey;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const supportItems: SupportItem[] = [
  {
    key: "guidance",
    label: "GUIDANCE",
    title: "Trainer Guidance",
    description:
      "Get clear explanations, practical guidance, and help when a concept or task feels difficult.",
    icon: MessagesSquare,
  },
  {
    key: "clarity",
    label: "CLARITY",
    title: "Doubt Support",
    description:
      "Ask questions, clear confusion, and avoid carrying unresolved doubts into the next topic.",
    icon: CircleHelp,
  },
  {
    key: "feedback",
    label: "FEEDBACK",
    title: "Useful Feedback",
    description:
      "Understand what you’re doing well, what needs improvement, and what to work on next.",
    icon: MessageCircleCheck,
  },
  {
    key: "direction",
    label: "DIRECTION",
    title: "Progress Direction",
    description:
      "Stay clear on what you’ve completed, what comes next, and where your focus should be.",
    icon: Route,
  },
];

function GuidanceVisual({ activeSupport }: { activeSupport?: SupportKey }) {
  return (
    <div className={styles.guidanceVisual} data-active-visual={activeSupport}>
      <div className={styles.visualGlow} aria-hidden="true" />

      <div className={styles.visualImageShell}>
        <Image
          src="/images/why-us/learning-support/learning-support.png"
          alt="Mentor guiding a learner at a coding workstation with feedback and progress indicators"
          width={1280}
          height={1280}
          sizes="(max-width: 420px) 260px, (max-width: 767px) 300px, (max-width: 1023px) 340px, 390px"
          className={styles.visualImage}
          priority={false}
        />
      </div>

      <div className={styles.visualCaption}>
        <span className={styles.captionSignal} aria-hidden="true" />
        <span>Guidance throughout your learning journey</span>
      </div>
    </div>
  );
}

export function LearningSupport() {
  const motionRef = useAnimationVisibility();
  const [activeSupport, setActiveSupport] = useState<SupportKey | undefined>();

  const getSupportItem = (key: SupportKey) =>
    supportItems.find((item) => item.key === key)!;

  const renderSupport = (key: SupportKey) => {
    const item = getSupportItem(key);
    const Icon = item.icon;

    return (
      <article
        className={`${styles.supportItem} ${styles[item.key]}`}
        data-support={item.key}
        onPointerEnter={() => setActiveSupport(item.key)}
        onFocus={() => setActiveSupport(item.key)}
        onPointerLeave={() => setActiveSupport(undefined)}
        onBlur={() => setActiveSupport(undefined)}
        tabIndex={0}
      >
        <div className={styles.supportIcon} aria-hidden="true">
          <Icon size={28} strokeWidth={1.7} />
        </div>

        <div className={styles.supportContent}>
          <span className={styles.supportLabel}>{item.label}</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      </article>
    );
  };

  return (
    <section
      ref={motionRef}
      className={styles.section}
      aria-labelledby="learning-support-title"
    >
      <div className={styles.backgroundGrid} aria-hidden="true" />
      <div className={styles.backgroundGlow} aria-hidden="true" />

      <div className={styles.container}>
        <header className={styles.heading}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>LEARNING SUPPORT</span>
            <span className={styles.eyebrowLine} />
          </div>

          <h2 id="learning-support-title">
            Guidance When You Need It.
            <span>Direction When It Matters.</span>
          </h2>

          <p>
            Learning becomes easier when you’re not left guessing. Get practical
            guidance, useful feedback, and clear direction throughout your
            progress.
          </p>
        </header>

        <div
          className={styles.supportSystem}
          data-active-support={activeSupport}
        >
          <div className={styles.connectionLayer} aria-hidden="true">
            <svg viewBox="0 0 1180 580" preserveAspectRatio="none">
              <path
                className={`${styles.connection} ${styles.connectionGuidance}`}
                d="M330 150C410 175 445 220 500 268"
              />

              <path
                className={`${styles.connection} ${styles.connectionFeedback}`}
                d="M850 150C770 175 735 220 680 268"
              />

              <path
                className={`${styles.connection} ${styles.connectionClarity}`}
                d="M330 430C410 405 445 360 500 312"
              />

              <path
                className={`${styles.connection} ${styles.connectionDirection}`}
                d="M850 430C770 405 735 360 680 312"
              />
            </svg>
          </div>

          {/* Visual first in DOM so mobile reads naturally. */}
          <div className={styles.visualSlot}>
            <GuidanceVisual activeSupport={activeSupport} />
          </div>

          <div className={styles.guidanceSlot}>{renderSupport("guidance")}</div>

          <div className={styles.claritySlot}>{renderSupport("clarity")}</div>

          <div className={styles.feedbackSlot}>{renderSupport("feedback")}</div>

          <div className={styles.directionSlot}>
            {renderSupport("direction")}
          </div>
        </div>
      </div>
    </section>
  );
}
