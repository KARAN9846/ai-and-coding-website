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

      <div className={`${styles.dataCard} ${styles.dataCardTop}`}>
        <span className={styles.dataDot} />
        <span>AI SYSTEM</span>
      </div>

      <div className={`${styles.dataCard} ${styles.dataCardBottom}`}>
        <span>LEARNING</span>
        <span className={styles.dataValue}>∞</span>
      </div>

      <div className={styles.cornerTopLeft} />
      <div className={styles.cornerBottomRight} />
    </div>
  );
}
