import {
  BriefcaseBusiness,
  Code2,
  Compass,
  GraduationCap,
  RefreshCw,
  School,
} from "lucide-react";

import styles from "./audience-paths.module.css";

const audiences = [
  { title: "School Students", detail: "Standard 5 onwards", icon: School },
  { title: "College Students", icon: GraduationCap },
  { title: "Working Professionals", icon: BriefcaseBusiness },
  { title: "Homemakers & Career Restarters", icon: RefreshCw },
  { title: "Beginners & Tech Enthusiasts", icon: Compass },
  { title: "Developers & Engineers", icon: Code2 },
];

export function AudiencePaths() {
  return (
    <section className={styles.section} aria-labelledby="audience-title">
      <div className={styles.shell}>
        <div className={styles.heading}>
          <h2 id="audience-title">FOR EVERYONE</h2>
          <p>From Standard 5 students to professionals and developers.</p>
        </div>

        <div className={styles.grid}>
          {audiences.map((audience) => {
            const Icon = audience.icon;

            return (
              <div key={audience.title} className={styles.chip}>
                <span className={styles.icon} aria-hidden="true">
                  <Icon size={21} strokeWidth={1.85} />
                </span>
                <div>
                  <h3>{audience.title}</h3>
                  {audience.detail && <p>{audience.detail}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
