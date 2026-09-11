"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ComponentType } from "react";
import { createPortal } from "react-dom";
import {
  SiC, SiCplusplus, SiHtml5, SiCss, SiJavascript, SiPython,
  SiSpring, SiSpringboot, SiAndroid, SiFirebase, SiIos, SiFigma,
  SiWondersharefilmora,
} from "react-icons/si";
import { FaJava } from "react-icons/fa6";
import { DiPhotoshop } from "react-icons/di";
import {
  Database, DatabaseZap, Network, ChartNoAxesCombined, Layers, Workflow,
  Monitor, Palette, Captions, NotebookPen, PenLine, Scissors, Clapperboard,
  Film, Route, CalendarDays, UsersRound, KeyRound, FileSearch, Megaphone,
  Image as ImageIcon, Video, Bot, WandSparkles,
} from "lucide-react";

import styles from "./course-topic-icons.module.css";

type TopicIcon = {
  icon: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  color?: string;
};

const topicIcons = {
  C: { icon: SiC, color: "#659ad2" },
  "C++": { icon: SiCplusplus, color: "#659ad2" },
  HTML: { icon: SiHtml5, color: "#e75b30" },
  CSS: { icon: SiCss, color: "#9566ce" },
  JavaScript: { icon: SiJavascript, color: "#f0db4f" },
  Java: { icon: FaJava, color: "#e77a40" },
  Python: { icon: SiPython, color: "#4b95ca" },
  SQL: { icon: Database },
  "Data Structure": { icon: Network },
  Tableau: { icon: ChartNoAxesCombined },
  Database: { icon: Database },
  "Advanced SQL": { icon: DatabaseZap },
  "Advanced Java": { icon: FaJava, color: "#e77a40" },
  "Spring Framework": { icon: SiSpring, color: "#6db33f" },
  Core: { icon: Layers, color: "#6db33f" },
  Boot: { icon: SiSpringboot, color: "#6db33f" },
  MVC: { icon: Workflow, color: "#6db33f" },
  Android: { icon: SiAndroid, color: "#3ddc84" },
  Firebase: { icon: SiFirebase, color: "#f5a623" },
  iOS: { icon: SiIos },
  CCC: { icon: Monitor },
  Photoshop: { icon: DiPhotoshop, color: "#31a8ff" },
  Canva: { icon: Palette, color: "#24b6bd" },
  Figma: { icon: SiFigma, color: "#ee775e" },
  Captions: { icon: Captions },
  Blogs: { icon: NotebookPen },
  Copywriting: { icon: PenLine },
  CapCut: { icon: Scissors },
  VN: { icon: Clapperboard },
  Lightworks: { icon: Film },
  Filmora: { icon: SiWondersharefilmora, color: "#2dbbb0" },
  Strategy: { icon: Route },
  Reels: { icon: Clapperboard },
  Scheduling: { icon: CalendarDays },
  "Social Media Account Management": { icon: UsersRound },
  Keywords: { icon: KeyRound },
  "On-page SEO": { icon: FileSearch },
  "Social Campaign": { icon: Megaphone },
  Poster: { icon: ImageIcon },
  Video: { icon: Video },
  ChatGPT: { icon: Bot, color: "#36ab90" },
  "DALL\u00b7E": { icon: ImageIcon, color: "#b584dd" },
  "Canva Magic Tools": { icon: WandSparkles, color: "#24b6bd" },
} satisfies Record<string, TopicIcon>;

export type CourseTopic = keyof typeof topicIcons;

type OpenTip = { topic: CourseTopic; left: number; top: number; above: boolean };

export function CourseTopicIcons({ topics }: { topics: readonly CourseTopic[] }) {
  const [tip, setTip] = useState<OpenTip | null>(null);
  const rowRef = useRef<HTMLUListElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tipId = useId();

  function cancelDismiss() {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
  }

  function dismissSoon() {
    cancelDismiss();
    dismissTimer.current = setTimeout(() => setTip(null), 120);
  }

  function show(topic: CourseTopic, target: HTMLButtonElement) {
    cancelDismiss();
    const rect = target.getBoundingClientRect();
    const halfWidth = Math.min(120, (window.innerWidth - 24) / 2);
    const above = rect.bottom + 88 > window.innerHeight;
    setTip({
      topic,
      left: Math.max(halfWidth + 12, Math.min(window.innerWidth - halfWidth - 12, rect.left + rect.width / 2)),
      top: above ? rect.top - 8 : rect.bottom + 8,
      above,
    });
  }

  useEffect(() => () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
  }, []);

  const open = tip !== null;
  useEffect(() => {
    if (!open) return;
    const close = () => setTip(null);
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rowRef.current?.contains(event.target) && !tipRef.current?.contains(event.target)) close();
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <ul ref={rowRef} className={styles.row} aria-label="Course topics">
        {topics.map((topic) => {
          const { icon: Icon, color }: TopicIcon = topicIcons[topic];
          return (
            <li key={topic}>
              <button
                type="button"
                className={styles.icon}
                style={{ "--topic-accent": color ?? "var(--primary)" } as CSSProperties}
                aria-label={topic}
                aria-describedby={tip?.topic === topic ? tipId : undefined}
                onPointerEnter={(event) => { if (event.pointerType === "mouse") show(topic, event.currentTarget); }}
                onPointerLeave={(event) => { if (event.pointerType === "mouse") dismissSoon(); }}
                onFocus={(event) => show(topic, event.currentTarget)}
                onBlur={dismissSoon}
                onClick={(event) => show(topic, event.currentTarget)}
              >
                <Icon size={25} aria-hidden={true} />
              </button>
            </li>
          );
        })}
      </ul>
      {tip && createPortal(
        <div
          ref={tipRef}
          id={tipId}
          role="tooltip"
          className={styles.tooltip}
          style={{ left: tip.left, top: tip.top, transform: `translate(-50%, ${tip.above ? "-100%" : "0"})` }}
          onPointerEnter={cancelDismiss}
          onPointerLeave={dismissSoon}
        >
          {tip.topic}
        </div>,
        document.body,
      )}
    </>
  );
}
