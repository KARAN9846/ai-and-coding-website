"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useAnimationVisibility } from "../motion/use-animation-visibility";
import {
  ArrowUpRight,
  BrainCircuit,
  Code2,
  Database,
  Palette,
  Sparkles,
  Video,
} from "lucide-react";
import styles from "./choose-path.module.css";

const cardStyle = {
  "--mouse-x": "50%",
  "--mouse-y": "35%",
  "--tilt-x": "0deg",
  "--tilt-y": "0deg",
} as CSSProperties;

export function ChoosePath() {
  const motionRef = useAnimationVisibility();
  const handleCardPointerMove = (event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const tiltY = (x - 50) * 0.07;
    const tiltX = (50 - y) * 0.05;

    card.style.setProperty("--mouse-x", `${x.toFixed(2)}%`);
    card.style.setProperty("--mouse-y", `${y.toFixed(2)}%`);
    card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
  };

  const resetCardPointer = (event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;

    card.style.setProperty("--mouse-x", "50%");
    card.style.setProperty("--mouse-y", "35%");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <section ref={motionRef} className={styles.section} aria-labelledby="choose-path-title">
      <div className={styles.sectionGrid} aria-hidden="true" />
      <span className={`${styles.sectionParticle} ${styles.particleOne}`} />
      <span className={`${styles.sectionParticle} ${styles.particleTwo}`} />

      <div className={styles.container}>
        {/* Section heading */}
        <div className={styles.heading}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>EXPLORE YOUR POTENTIAL</span>
            <span className={styles.eyebrowLine} />
          </div>

          <h2 id="choose-path-title">
            Choose Your <span>Path</span>
          </h2>

          <p>
            Build practical technology skills through a learning path designed
            around your goals, interests, and future.
          </p>
        </div>

        {/* Path cards */}
        <div className={styles.paths}>
          {/* F2P */}
          <article
            className={`${styles.pathCard} ${styles.f2pCard}`}
            onPointerMove={handleCardPointerMove}
            onPointerLeave={resetCardPointer}
            style={cardStyle}
          >
            <div className={styles.cardGlow} />

            <div className={styles.cardTop}>
              <span className={styles.number}>01</span>

              <div className={styles.cardIcon}>
                <Code2 size={22} strokeWidth={1.7} />
              </div>
            </div>

            <div className={styles.f2pContent}>
              <div className={styles.cardLabel}>CAREER-FOCUSED PROGRAM</div>

              <h3>
                F2P
                <span>Fresher to Professional</span>
              </h3>

              <p>
                A structured journey that takes you from foundation programming
                through databases, enterprise development and advanced
                specialization.
              </p>

              <div className={styles.techStack}>
                <span>
                  <Code2 size={14} />
                  Programming
                </span>

                <span>
                  <Database size={14} />
                  Database
                </span>

                <span>
                  <BrainCircuit size={14} />
                  AI & Data
                </span>
              </div>

              <div className={styles.f2pJourney}>
                <div className={styles.journeyLine} />

                <div className={styles.journeyItem}>
                  <strong>01</strong>
                  <span>Foundation</span>
                </div>

                <div className={styles.journeyItem}>
                  <strong>02</strong>
                  <span>Database</span>
                </div>

                <div className={styles.journeyItem}>
                  <strong>03</strong>
                  <span>Development</span>
                </div>

                <div className={styles.journeyItem}>
                  <strong>04</strong>
                  <span>Specialize</span>
                </div>

                <div className={styles.journeyItem}>
                  <strong>05</strong>
                  <span>Professional</span>
                </div>
              </div>

              <a href="#f2p" className={styles.cardLink}>
                <span>Explore F2P</span>
                <ArrowUpRight size={18} />
              </a>
            </div>

            {/* Decorative visual */}
            <div className={styles.f2pVisual} aria-hidden="true">
              <div className={`${styles.orbit} ${styles.orbitOne}`} />
              <div className={`${styles.orbit} ${styles.orbitTwo}`} />
              <div className={`${styles.orbit} ${styles.orbitThree}`} />

              <div className={styles.core}>
                <Code2 size={34} strokeWidth={1.4} />
              </div>

              <span className={`${styles.node} ${styles.nodeOne}`} />
              <span className={`${styles.node} ${styles.nodeTwo}`} />
              <span className={`${styles.node} ${styles.nodeThree}`} />
              <span className={`${styles.node} ${styles.nodeFour}`} />
            </div>
          </article>

          {/* Skill Development */}
          <article
            className={`${styles.pathCard} ${styles.skillsCard}`}
            onPointerMove={handleCardPointerMove}
            onPointerLeave={resetCardPointer}
            style={cardStyle}
          >
            <div className={styles.cardGlow} />

            <div className={styles.cardTop}>
              <span className={styles.number}>02</span>

              <div className={styles.cardIcon}>
                <Sparkles size={22} strokeWidth={1.7} />
              </div>
            </div>

            <div className={styles.skillsContent}>
              <div className={styles.cardLabel}>PRACTICAL DIGITAL SKILLS</div>

              <h3>
                Skill
                <span>Development</span>
              </h3>

              <p>
                Learn practical skills for the digital world — from design and
                content to video, SEO, social media, and AI-powered creation.
              </p>

              <div className={styles.skillCloud}>
                <span className={styles.skillMain}>
                  <Sparkles size={16} />
                  AI Tools
                </span>

                <span>
                  <Palette size={15} />
                  Design
                </span>

                <span>Content</span>

                <span>
                  <Video size={15} />
                  Video
                </span>

                <span>SEO</span>

                <span>Social Media</span>

                <span>Portfolio</span>
              </div>

              <div className={styles.skillsBottom}>
                <div className={styles.miniStats}>
                  <strong>07</strong>
                  <span>Skill Areas</span>
                </div>

                <a href="#skill-development" className={styles.cardLink}>
                  <span>Explore Skills</span>
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

            {/* Decorative visual */}
            <div className={styles.skillsVisual} aria-hidden="true">
              <div className={styles.skillsRing} />

              <div className={styles.skillsCenter}>
                <Sparkles size={28} strokeWidth={1.5} />
              </div>

              <span className={`${styles.skillDot} ${styles.dotOne}`} />
              <span className={`${styles.skillDot} ${styles.dotTwo}`} />
              <span className={`${styles.skillDot} ${styles.dotThree}`} />
              <span className={`${styles.skillDot} ${styles.dotFour}`} />
              <span className={`${styles.skillDot} ${styles.dotFive}`} />
            </div>
          </article>
        </div>

        {/* Bottom statement */}
        <div className={styles.bottomStatement}>
          <div className={styles.statementIcon}>
            <BrainCircuit size={18} strokeWidth={1.6} />
          </div>

          <p>
            <strong>One platform.</strong> Multiple ways to build your future.
          </p>

          <div className={styles.statementLine} />
        </div>
      </div>
    </section>
  );
}
