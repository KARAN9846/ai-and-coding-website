"use client";

import { useWorkshopConfiguration } from "@/components/workshops/use-workshop-configuration";
import type { PublicWorkshopConfiguration } from "@/lib/workshops/public-configuration";
import { WORKSHOP_ICON_MAP } from "@/components/workshops/workshop-icon";
import {
  WORKSHOP_AUDIENCE_OPTIONS,
  type WorkshopAudienceKey,
  type WorkshopTheme,
} from "@/lib/workshops/workshop-data";

import styles from "./workshop-tracks.module.css";

const themeClasses: Record<WorkshopTheme, string> = {
  "cyan-blue": styles.toolsProgram,
  "blue-violet": styles.developerProgram,
  "orange-cyan": styles.roboticsProgram,
  "emerald-blue": styles.emeraldProgram,
};
const countClasses: Record<number, string> = {
  1: styles.countOne,
  2: styles.countTwo,
  3: styles.countThree,
  4: styles.countFour,
};
const audienceLabels = Object.fromEntries(
  WORKSHOP_AUDIENCE_OPTIONS.map((option) => [option.value, option.label]),
) as Record<WorkshopAudienceKey, string>;

export function WorkshopTracks({
  initialConfiguration,
}: {
  initialConfiguration: PublicWorkshopConfiguration | null;
}) {
  const state = useWorkshopConfiguration(initialConfiguration);
  if (state.phase !== "ready" || state.configuration.workshops.length === 0) {
    return null;
  }
  const workshops = state.configuration.workshops;

  return (
    <section id="workshop-tracks" className={styles.section} aria-labelledby="tracks-title">
      <div className={styles.shell}>
        <div className={styles.heading}>
          <h2 id="tracks-title">Explore Our Workshops</h2>
          <p>Practical learning paths designed for different goals and experience levels.</p>
        </div>

        <div className={`${styles.programs} ${countClasses[workshops.length] ?? ""}`}>
          {workshops.map((workshop) => {
            const MainIcon = WORKSHOP_ICON_MAP[workshop.mainIcon];
            const hasTargeting = workshop.targeting.audiences ||
              workshop.targeting.standards || workshop.targeting.ageRange;
            const targetsEveryone = workshop.targeting.audiences?.includes("everyone") === true;
            return (
              <article key={workshop.id} className={`${styles.program} ${themeClasses[workshop.theme]}`}>
                <header className={styles.programHeader}>
                  <span className={styles.programIcon} aria-hidden="true">
                    <MainIcon size={28} strokeWidth={1.75} />
                  </span>
                  <h3>{workshop.title}</h3>
                </header>
                <p className={styles.description}>{workshop.description}</p>
                {hasTargeting && (
                  <div className={styles.targeting} aria-label="Who this Workshop is for">
                    <strong>{targetsEveryone ? "FOR" : "ONLY FOR"}</strong>
                    <div className={styles.targetingValues}>
                      {workshop.targeting.audiences?.map((audience) => (
                        <span key={audience}>{audienceLabels[audience]}</span>
                      ))}
                      {workshop.targeting.standards && (
                        <span>Standards {workshop.targeting.standards.join(", ")}</span>
                      )}
                      {workshop.targeting.ageRange && (
                        <span>Ages {workshop.targeting.ageRange.min}–{workshop.targeting.ageRange.max}</span>
                      )}
                    </div>
                  </div>
                )}
                <ul className={styles.focusAreas}>
                  {workshop.focusAreas.map((focusArea) => {
                    const FocusIcon = WORKSHOP_ICON_MAP[focusArea.icon];
                    return (
                      <li key={focusArea.label}>
                        <span aria-hidden="true"><FocusIcon size={15} strokeWidth={1.9} /></span>
                        <strong className={styles.focusLabel}>{focusArea.label}</strong>
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
