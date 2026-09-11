"use client";

import { type MouseEvent } from "react";
import Image, { type StaticImageData } from "next/image";
import { ArrowUpRight } from "lucide-react";

import computerImage from "@/public/images/courses/skill-development/basic-computer-foundation.png";
import designImage from "@/public/images/courses/skill-development/visual-design.png";
import contentImage from "@/public/images/courses/skill-development/content-creation.png";
import videoImage from "@/public/images/courses/skill-development/video-editing.png";
import socialImage from "@/public/images/courses/skill-development/social-media-handling.png";
import seoImage from "@/public/images/courses/skill-development/seo-basics.png";
import portfolioImage from "@/public/images/courses/skill-development/project-portfolio.png";
import aiImage from "@/public/images/courses/skill-development/ai-tools-for-creators.png";

import styles from "./skill-development.module.css";
import { CourseTopicIcons, type CourseTopic } from "../course-topic-icons/course-topic-icons";

type Skill = {
  id: string;
  title: string;
  description: string;
  topics: CourseTopic[];
  iconTopics?: CourseTopic[];
  image: StaticImageData;
  alt: string;
};

const skills: Skill[] = [
  {
    id: "basic-computer-foundation",
    title: "Basic Computer Foundation",
    description: "Build a foundation in everyday computer use.",
    topics: ["CCC"],
    image: computerImage,
    alt: "Computer, keyboard, files, and application elements connected in a learning system",
  },
  {
    id: "visual-design",
    title: "Visual Design",
    description: "Create visual compositions with practical design tools.",
    topics: ["Photoshop", "Canva", "Figma"],
    image: designImage,
    alt: "Layered design canvas connected to vector handles, color swatches, and a stylus",
  },
  {
    id: "content-creation",
    title: "Content Creation",
    description: "Develop content through captions, blogs, and copywriting.",
    topics: ["Captions", "Blogs", "Copywriting"],
    image: contentImage,
    alt: "Writing sheets and content blocks connected to an editorial planning composition",
  },
  {
    id: "video-editing",
    title: "Video Editing",
    description: "Edit and assemble video content with creative tools.",
    topics: ["CapCut", "VN", "Canva", "Lightworks", "Filmora"],
    image: videoImage,
    alt: "Video frames, playback controls, and audio waveforms connected to an editing timeline",
  },
  {
    id: "social-media-handling",
    title: "Social Media Handling",
    description: "Plan content and manage your social media presence.",
    topics: ["Strategy", "Reels", "Scheduling", "Social Media Account Management"],
    image: socialImage,
    alt: "Social content posts connected to a scheduling calendar and account-management elements",
  },
  {
    id: "seo-basics",
    title: "SEO Basics",
    description: "Understand keywords and on-page search optimization.",
    topics: ["Keywords", "On-page SEO"],
    image: seoImage,
    alt: "Search field and magnifier connected to webpage structure and keyword elements",
  },
  {
    id: "project-portfolio",
    title: "Project & Portfolio",
    description: "Create Social Campaign + Poster + Video",
    topics: [],
    iconTopics: ["Social Campaign", "Poster", "Video"],
    image: portfolioImage,
    alt: "A coordinated project showcase connecting a social campaign, poster, and video",
  },
];

const creatorTools: Skill = {
  id: "ai-tools-for-creators",
  title: "AI Tools for Creators",
  description: "Explore AI tools for content, visual creation, and creative work.",
  topics: ["ChatGPT", "DALL\u00b7E", "Canva Magic Tools"],
  image: aiImage,
  alt: "Creative processor connected to writing, image creation, and design elements",
};

export function SkillDevelopment() {
  return (
    <section
      id="skill-development"
      className={styles.section}
      aria-labelledby="skill-development-title"
    >
      <div className={styles.container}>
        <header className={styles.heading}>
          <div className={styles.eyebrow}>PRACTICAL SKILLS</div>
          <h2 id="skill-development-title">Skill Development Courses</h2>
          <p>
            Build practical digital skills, create projects, and develop your
            portfolio.
          </p>
        </header>

        <div className={styles.journey}>
          {skills.map((skill, index) => (
            <SkillStage skill={skill} reverse={index % 2 === 1} key={skill.id} />
          ))}
          <SkillStage skill={creatorTools} featured reverse />
        </div>
      </div>
    </section>
  );
}

function handleImageMove(event: MouseEvent<HTMLElement>) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
  target.style.setProperty("--stage-x", `${((x - 0.5) * 10).toFixed(2)}px`);
  target.style.setProperty("--stage-y", `${((y - 0.5) * 8).toFixed(2)}px`);
}

function resetImageMove(event: MouseEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--stage-x", "0px");
  event.currentTarget.style.setProperty("--stage-y", "0px");
}

function SkillStage({
  skill,
  reverse = false,
  featured = false,
}: {
  skill: Skill;
  reverse?: boolean;
  featured?: boolean;
}) {
  const titleId = `skill-${skill.id}-title`;

  return (
    <article
      className={`${styles.stage} ${reverse ? styles.reverse : ""} ${featured ? styles.featured : ""}`}
      aria-labelledby={titleId}
      onMouseMove={handleImageMove}
      onMouseLeave={resetImageMove}
    >
      <SkillRoute featured={featured} />
      <div className={styles.content}>
        {featured && <span className={styles.featureLabel}>CREATOR TOOLS</span>}
        <h3 id={titleId}>{skill.title}</h3>
        <p>{skill.description}</p>
        {skill.topics.length > 0 && (
          <ul className={styles.topics} aria-label="Course topics and tools">
            {skill.topics.map((topic) => <li key={topic}>{topic}</li>)}
          </ul>
        )}
        <CourseTopicIcons topics={skill.iconTopics ?? skill.topics} />
        {featured && (
          <a href="#enquiry" className={styles.enquiryLink}>
            <span>Enquire About Skills</span>
            <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
          </a>
        )}
      </div>
      <div className={styles.milestone} aria-hidden="true"><span /></div>
      <div className={styles.artwork}>
        <Image
          src={skill.image}
          alt={skill.alt}
          fill
          quality={90}
          loading="lazy"
          sizes="(max-width: 768px) min(360px, calc(100vw - 72px)), (max-width: 1024px) min(400px, calc((100vw - 48px) * 0.43)), 400px"
          className={styles.image}
        />
      </div>
    </article>
  );
}

function SkillRoute({ featured }: { featured: boolean }) {
  // Every row meets at the same endpoints; the milestone stays inside the gutter.
  const curve = featured
    ? "M500 0 C500 64 460 96 460 160"
    : "M500 0 C500 64 460 96 460 160 C460 224 500 256 500 320";
  const branches = "M460 160 C444 160 440 144 420 144 M460 160 C512 160 532 176 580 176";

  return (
    <>
      <svg className={styles.route} viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path className={styles.routeGlow} d={curve} />
        <path className={styles.routeLine} d={curve} />
        <path className={styles.routeEnergy} d={curve} />
        <path className={styles.connector} d={branches} />
      </svg>
      <svg className={styles.mobileRoute} viewBox="0 0 32 320" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path className={styles.routeLine} d="M12 0 C12 110 20 200 12 320" />
      </svg>
    </>
  );
}
