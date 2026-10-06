"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";

import { useWorkshopConfiguration } from "@/components/workshops/use-workshop-configuration";
import type { PublicWorkshopConfiguration } from "@/lib/workshops/public-configuration";

import styles from "./workshop-hero.module.css";

export function WorkshopHero({
  initialConfiguration,
}: {
  initialConfiguration: PublicWorkshopConfiguration | null;
}) {
  const workshopConfiguration = useWorkshopConfiguration(initialConfiguration);
  const registrationOpen =
    workshopConfiguration.phase === "ready" &&
    workshopConfiguration.configuration.registrationOpen;
  const statusLabel =
    workshopConfiguration.phase === "loading"
      ? "CHECKING REGISTRATION"
      : workshopConfiguration.phase === "unavailable"
        ? "REGISTRATION UNAVAILABLE"
        : registrationOpen
          ? "REGISTRATION OPEN"
          : "REGISTRATION CLOSED";

  return (
    <section className={styles.hero} aria-labelledby="workshop-hero-title">
      <div className={styles.shell}>
        <div className={styles.grid} aria-hidden="true" />

        <div className={styles.content}>
          <div className={styles.topline}>
            <p className={styles.eyebrow}>OFFLINE WORKSHOPS</p>
            <p
              className={`${styles.status} ${
                registrationOpen ? styles.statusOpen : ""
              }`}
              role="status"
              aria-live="polite"
            >
              <span aria-hidden="true" />
              {statusLabel}
            </p>
          </div>

          <h1 id="workshop-hero-title">
            AI Workshops <span>for Everyone.</span>
          </h1>

          <p className={styles.headline}>Learn. Build. Grow with AI.</p>
          <p className={styles.description}>
            Practical offline AI workshops for students, professionals,
            beginners and developers.
          </p>

          <p className={styles.philosophy}>
            <Sparkles size={14} strokeWidth={1.9} aria-hidden="true" />
            Anyone Can Learn. Everyone Can Grow.
          </p>

          <div className={styles.actions}>
            <Link href="#workshop-registration" className={styles.primaryCta}>
              Register for a Workshop
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link href="#workshop-tracks" className={styles.secondaryCta}>
              Explore Workshops
              <ArrowDown size={15} strokeWidth={1.9} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.imageGlow} aria-hidden="true" />
          <Image
            src="/images/workshops/ai-coding-assistant-hero.png"
            alt="Futuristic AI assistant with coding tools and a laptop"
            width={1536}
            height={1024}
            priority
            quality={90}
            sizes="(max-width: 640px) 92vw, (max-width: 1023px) 46vw, 44vw"
            className={styles.artwork}
          />
        </div>
      </div>
    </section>
  );
}
