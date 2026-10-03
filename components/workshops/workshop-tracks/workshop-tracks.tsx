import {
  Blocks,
  BookOpen,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Bug,
  CircuitBoard,
  Code2,
  Cpu,
  GitBranch,
  MessageSquareText,
  Palette,
  PanelsTopLeft,
  Radio,
  ScanEye,
  ScanSearch,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import {
  WORKSHOP_PROGRAMS,
  type WorkshopProgramId,
} from "@/lib/workshops/workshop-data";

import styles from "./workshop-tracks.module.css";

const programVisuals: Record<
  WorkshopProgramId,
  { icon: LucideIcon; focusIcons: readonly LucideIcon[]; className: string }
> = {
  "ai-tools-prompting": {
    icon: Bot,
    focusIcons: [
      BrainCircuit,
      MessageSquareText,
      BookOpen,
      BriefcaseBusiness,
      Palette,
      Workflow,
    ],
    className: styles.toolsProgram,
  },
  "ai-coding-developer-growth": {
    icon: Code2,
    focusIcons: [Code2, PanelsTopLeft, Bug, ScanSearch, GitBranch, Blocks],
    className: styles.developerProgram,
  },
  "ai-robotics": {
    icon: Cpu,
    focusIcons: [Bot, Radio, Cpu, BrainCircuit, ScanEye, CircuitBoard],
    className: styles.roboticsProgram,
  },
};

export function WorkshopTracks() {
  return (
    <section
      id="workshop-tracks"
      className={styles.section}
      aria-labelledby="tracks-title"
    >
      <div className={styles.shell}>
        <div className={styles.heading}>
          <h2 id="tracks-title">Explore Our Workshops</h2>
          <p>
            Three practical learning paths designed for different goals and
            experience levels.
          </p>
        </div>

        <div className={styles.programs}>
          {WORKSHOP_PROGRAMS.map((program) => {
            const visual = programVisuals[program.id];
            const ProgramIcon = visual.icon;

            return (
              <article
                key={program.id}
                className={`${styles.program} ${visual.className}`}
              >
                <header className={styles.programHeader}>
                  <span className={styles.programIcon} aria-hidden="true">
                    <ProgramIcon size={28} strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3>{program.title}</h3>
                  </div>
                </header>

                <p className={styles.description}>{program.description}</p>

                <ul className={styles.focusAreas}>
                  {program.focusAreas.map((focusArea, focusIndex) => {
                    const FocusIcon = visual.focusIcons[focusIndex];

                    return (
                      <li key={focusArea}>
                        <span aria-hidden="true">
                          <FocusIcon size={15} strokeWidth={1.9} />
                        </span>
                        {focusArea}
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
