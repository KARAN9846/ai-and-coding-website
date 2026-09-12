import { BrainCircuit, Code2, Database, Blocks } from "lucide-react";
import styles from "./hero-visual.module.css";

export function HeroVisual() {
  return (
    <div className={styles.visual}>
      <div className={styles.glow} />

      <div className={styles.visual3d}>
        <div className={`${styles.cssRing} ${styles.cssRingOne}`} />
        <div className={`${styles.cssRing} ${styles.cssRingTwo}`} />
        <div className={`${styles.cssRing} ${styles.cssRingThree}`} />

        <div className={styles.cssEngine}>
          <div className={`${styles.cssPanel} ${styles.cssPanelOne}`}>
            {Array.from({ length: 7 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>

          <div className={`${styles.cssPanel} ${styles.cssPanelTwo}`}>
            {Array.from({ length: 6 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>

          <div className={`${styles.cssPanel} ${styles.cssPanelThree}`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>

          <div className={styles.cssCore}>
            <span className={styles.cssCoreInner} />
            <span className={`${styles.cssNode} ${styles.cssNodeOne}`} />
            <span className={`${styles.cssNode} ${styles.cssNodeTwo}`} />
            <span className={`${styles.cssNode} ${styles.cssNodeThree}`} />
            <span className={`${styles.cssNode} ${styles.cssNodeFour}`} />
            <span className={`${styles.cssNode} ${styles.cssNodeFive}`} />
          </div>
        </div>
      </div>

      <div className={styles.markers} aria-hidden="true">
        <span className={styles.markerAi}><BrainCircuit size={19} /><span>AI</span></span>
        <span className={styles.markerCode}><Code2 size={19} /><span>CODE</span></span>
        <span className={styles.markerData}><Database size={19} /><span>DATA</span></span>
        <span className={styles.markerProjects}><Blocks size={19} /><span>PROJECTS</span></span>
      </div>

      <div className={styles.cornerTopLeft} />
      <div className={styles.cornerBottomRight} />
    </div>
  );
}
