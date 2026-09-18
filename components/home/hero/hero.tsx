import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import learningForEveryone from "@/public/images/home/learning-for-everyone.png";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section
      className={styles.hero}
      aria-labelledby="learning-for-everyone-title"
    >
      <Link
        href="/enquiry#enquiry-options"
        className={styles.banner}
        aria-label="Find Your Learning Path — choose learner or institution enquiry"
      >
        <div className={styles.content}>
          <p className={styles.eyebrow}>LEARN • BUILD • GROW</p>

          <h1 id="learning-for-everyone-title" className={styles.title}>
            <span className={styles.titlePrimary}>Anyone Can Learn.</span>
            <span className={styles.titleAccent}>Everyone Can Grow.</span>
          </h1>

          <p className={styles.description}>
            From Standard 6–7 students taking their first step to college learners
            and working professionals building new capabilities—everyone has room
            to learn, evolve, and grow.
          </p>

          <span className={styles.cta}>
            Find Your Learning Path
            <ArrowUpRight
              className={styles.arrow}
              size={20}
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>
        </div>

        <div className={styles.artwork}>
          <Image
            src={learningForEveryone}
            alt="Six school-age, college, and working adult learners exploring technology together with laptops, a tablet, and books."
            className={styles.image}
            sizes="(max-width: 480px) calc(100vw - 54px), (max-width: 768px) calc(100vw - 70px), (max-width: 980px) 680px, (max-width: 1100px) 54vw, (max-width: 1548px) 52vw, 720px"
            quality={75}
            preload
          />
        </div>
      </Link>
    </section>
  );
}
