"use client";

import type { CSSProperties } from "react";
import { usePointerMotion } from "../motion/use-pointer-motion";
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
import {
  SiFigma,
  SiGooglegemini,
  SiGoogledocs,
  SiGooglesearchconsole,
  SiWondersharefilmora,
} from "@icons-pack/react-simple-icons";
import styles from "./programs.module.css";

import { DiPython, DiJava, DiReact, DiMysql } from "react-icons/di";

type SkillTool = {
  label: string;
  Icon: React.ComponentType<{ size?: string | number; title?: string }>;
};

type SkillToolsVisualProps = {
  variant: "design" | "content" | "video" | "growth";
  tools: SkillTool[];
};

const skillToolsVisualClassNames: Record<
  SkillToolsVisualProps["variant"],
  string
> = {
  design: styles.skillToolsVisualDesign,
  content: styles.skillToolsVisualContent,
  video: styles.skillToolsVisualVideo,
  growth: styles.skillToolsVisualGrowth,
};

function SkillToolsVisual({ variant, tools }: SkillToolsVisualProps) {
  return (
    <div
      className={`${styles.skillToolsVisual} ${skillToolsVisualClassNames[variant]}`}
      aria-hidden="true"
    >
      <span className={styles.skillToolsOrbit} />
      {tools.map(({ label, Icon }, index) => (
        <span
          className={`${styles.skillTool} ${styles[`skillTool${index + 1}`]}`}
          key={label}
        >
          <Icon size={54} title={label} />
        </span>
      ))}
      <span className={`${styles.skillToolsDot} ${styles.skillToolsDotOne}`} />
      <span className={`${styles.skillToolsDot} ${styles.skillToolsDotTwo}`} />
    </div>
  );
}

const programPointerStyle = { "--mouse-x": "50%", "--mouse-y": "50%", "--tilt-x": "0deg", "--tilt-y": "0deg", "--f2p-x": "0px", "--f2p-y": "0px" } as CSSProperties;

export function Programs() {
  const motionRef = useAnimationVisibility();
  const f2pPointer = usePointerMotion(programPointerStyle, (x, y) => ({
    "--mouse-x": `${x * 100}%`, "--mouse-y": `${y * 100}%`, "--tilt-x": `${(0.5-y)*6}deg`, "--tilt-y": `${(x-0.5)*6}deg`,
    "--f2p-x": `${(x-0.5)*16}px`, "--f2p-y": `${(y-0.5)*16}px`,
  }));
  const cardPointer = usePointerMotion(programPointerStyle, (x, y) => ({ "--mouse-x": `${x * 100}%`, "--mouse-y": `${y * 100}%` }));

  return (
    <section ref={motionRef} className={styles.section} aria-labelledby="programs-title">
      <div className={styles.container}>
        {/* Section heading */}
        <div className={styles.heading}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>EXPLORE OUR PROGRAMS</span>
            <span className={styles.eyebrowLine} />
          </div>

          <h2 id="programs-title">
            Build Skills That <span>Move You Forward</span>
          </h2>

          <p>
            Explore practical learning paths designed to help you build
            technology skills for the real world.
          </p>
        </div>

        {/* Featured F2P program */}
        <article
          className={`${styles.programCard} ${styles.f2pCard}`}
          {...f2pPointer}
        >
          {" "}
          <div className={styles.cardGlow} />
          <div className={styles.cardContent}>
            <h3>
              F2P
              <span>Fresher to Professional</span>
            </h3>

            <p>
              A structured learning journey that takes you from programming
              fundamentals toward professional technology skills.
            </p>

            <div className={styles.path}>
              <span>Foundation</span>
              <i />
              <span>Database</span>
              <i />
              <span>Development</span>
              <i />
              <span>Specialization</span>
            </div>

            <div className={styles.techTags}>
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
                AI &amp; Data
              </span>
            </div>

            <a href="#f2p" className={styles.cardLink}>
              <span>Explore F2P</span>
              <ArrowUpRight size={18} />
            </a>
          </div>
          {/* F2P technology visual */}
          <div

            className={styles.f2pVisual}
            aria-hidden="true"
          >
            <div className={`${styles.orbit} ${styles.orbitOne}`} />
            <div className={`${styles.orbit} ${styles.orbitTwo}`} />
            <div className={`${styles.orbit} ${styles.orbitThree}`} />

            <div className={styles.core}>
              <Code2 size={32} strokeWidth={1.4} />
            </div>

            <span className={`${styles.node} ${styles.nodeOne}`} />
            <span className={`${styles.node} ${styles.nodeTwo}`} />
            <span className={`${styles.node} ${styles.nodeThree}`} />
            <span className={`${styles.node} ${styles.nodeFour}`} />

            <span className={`${styles.techIcon} ${styles.python}`}>
              <DiPython size={30} />
            </span>

            <span className={`${styles.techIcon} ${styles.java}`}>
              <DiJava size={30} />
            </span>

            <span className={`${styles.techIcon} ${styles.react}`}>
              <DiReact size={30} />
            </span>

            <span className={`${styles.techIcon} ${styles.sql}`}>
              <DiMysql size={30} />
            </span>
          </div>
        </article>

        {/* Skill Development showcase */}
        <div className={styles.skillsGrid}>
          <article
            className={`${styles.programCard} ${styles.skillCard}`}
            {...cardPointer}
          >
            <div className={styles.cardGlow} />

            <SkillToolsVisual
              variant="design"
              tools={[{ label: "Figma", Icon: SiFigma }]}
            />

            <div className={styles.skillIcon}>
              <Palette size={22} strokeWidth={1.6} />
            </div>

            <h3>
              Visual
              <span>Design</span>
            </h3>

            <p>Photoshop · Canva · Figma</p>

            <a href="#skill-development" className={styles.cardLink}>
              <span>Explore</span>
              <ArrowUpRight size={17} />
            </a>
          </article>

          <article
            className={`${styles.programCard} ${styles.skillCard}`}
            {...cardPointer}
          >
            <div className={styles.cardGlow} />

            <SkillToolsVisual
              variant="content"
              tools={[{ label: "Google Docs", Icon: SiGoogledocs }]}
            />

            <div className={styles.skillIcon}>
              <Sparkles size={22} strokeWidth={1.6} />
            </div>

            <h3>
              Content
              <span>Creation</span>
            </h3>

            <p>Content · Captions · Copywriting</p>

            <a href="#skill-development" className={styles.cardLink}>
              <span>Explore</span>
              <ArrowUpRight size={17} />
            </a>
          </article>

          <article
            className={`${styles.programCard} ${styles.skillCard}`}
            {...cardPointer}
          >
            <div className={styles.cardGlow} />

            <SkillToolsVisual
              variant="video"
              tools={[{ label: "Wondershare Filmora", Icon: SiWondersharefilmora }]}
            />

            <div className={styles.skillIcon}>
              <Video size={22} strokeWidth={1.6} />
            </div>

            <h3>
              Video
              <span>Editing</span>
            </h3>

            <p>CapCut · VN · Filmora</p>

            <a href="#skill-development" className={styles.cardLink}>
              <span>Explore</span>
              <ArrowUpRight size={17} />
            </a>
          </article>

          <article
            className={`${styles.programCard} ${styles.skillCard}`}
            {...cardPointer}
          >
            <div className={styles.cardGlow} />

            <SkillToolsVisual
              variant="growth"
              tools={[{ label: "Google Search Console", Icon: SiGooglesearchconsole }]}
            />

            <div className={styles.skillIcon}>
              <BrainCircuit size={22} strokeWidth={1.6} />
            </div>

            <h3>
              Digital
              <span>Growth</span>
            </h3>

            <p>SEO · Social Media · Portfolio</p>

            <a href="#skill-development" className={styles.cardLink}>
              <span>Explore</span>
              <ArrowUpRight size={17} />
            </a>
          </article>
        </div>

        {/* AI Tools highlight */}
        <article
          className={`${styles.programCard} ${styles.aiCard}`}
          {...cardPointer}
        >
          <div className={styles.aiIcon}>
            <Sparkles size={20} strokeWidth={1.6} />
          </div>

          <div>
            <span className={styles.aiLabel}>EXCLUSIVE LEARNING AREA</span>

            <h3>AI Tools for Creators</h3>

            <p>Explore modern AI tools for faster, smarter digital creation.</p>
          </div>

          <div className={styles.aiToolsVisual} aria-hidden="true">
            <span className={styles.aiToolsOrbit} />
            <span className={styles.aiToolsLogo}>
              <SiGooglegemini size={54} title="Google Gemini" />
            </span>
            <span className={`${styles.aiToolsDot} ${styles.aiToolsDotOne}`} />
            <span className={`${styles.aiToolsDot} ${styles.aiToolsDotTwo}`} />
          </div>

          <a href="#skill-development" className={styles.cardLink}>
            <span>Discover</span>
            <ArrowUpRight size={18} />
          </a>
        </article>

        {/* Section CTA */}
        <div className={styles.sectionCta}>
          <a href="#courses" className={styles.viewAll}>
            <span>View All Programs</span>
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
