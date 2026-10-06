"use client";

import { useEffect, useState } from "react";

import { useWorkshopConfiguration } from "@/components/workshops/use-workshop-configuration";
import type { PublicWorkshopConfiguration } from "@/lib/workshops/public-configuration";

import styles from "./workshop-discount-countdown.module.css";

type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const units: Array<{ key: keyof CountdownValue; label: string }> = [
  { key: "days", label: "DAYS" },
  { key: "hours", label: "HOURS" },
  { key: "minutes", label: "MIN" },
  { key: "seconds", label: "SEC" },
];

function getRemainingTime(deadline: string): CountdownValue | null {
  const deadlineTime = new Date(deadline).getTime();

  if (!Number.isFinite(deadlineTime)) return null;

  const totalSeconds = Math.max(
    0,
    Math.ceil((deadlineTime - Date.now()) / 1000),
  );

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}

function isExpired(value: CountdownValue) {
  return Object.values(value).every((unit) => unit === 0);
}

export function WorkshopDiscountCountdown({
  initialConfiguration,
}: {
  initialConfiguration: PublicWorkshopConfiguration | null;
}) {
  const workshopConfiguration = useWorkshopConfiguration(initialConfiguration);
  const [remaining, setRemaining] = useState<CountdownValue | null>(null);
  const discount =
    workshopConfiguration.phase === "ready"
      ? workshopConfiguration.configuration.discount
      : null;
  const deadline = discount?.enabled ? discount.deadline : null;

  useEffect(() => {
    if (!deadline || !Number.isFinite(new Date(deadline).getTime())) {
      return;
    }

    const updateCountdown = () => {
      const nextRemaining = getRemainingTime(deadline);
      setRemaining(nextRemaining);

      return nextRemaining === null || isExpired(nextRemaining);
    };

    if (updateCountdown()) return;

    const interval = window.setInterval(() => {
      if (updateCountdown()) window.clearInterval(interval);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [deadline]);

  if (
    !discount?.enabled ||
    !deadline ||
    !Number.isFinite(new Date(deadline).getTime())
  ) {
    return null;
  }

  const expired = remaining !== null && isExpired(remaining);
  const accessibleTime = remaining
    ? `${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes and ${remaining.seconds} seconds remaining`
    : "Countdown loading";

  return (
    <section className={styles.section} aria-labelledby="workshop-offer-title">
      <div className={`${styles.strip} ${expired ? styles.expiredStrip : ""}`}>
        <div className={styles.copy}>
          <h2 id="workshop-offer-title">
            {expired ? discount.expiredMessage : discount.message}
          </h2>
          {!expired && (
            <p className={styles.supportingText}>
              Register before the timer ends to avail the current workshop
              discount.
            </p>
          )}
        </div>

        {!expired && (
          <div
            className={styles.timer}
            role="timer"
            aria-live="off"
            aria-label={accessibleTime}
          >
            {units.map((unit) => (
              <div key={unit.key} className={styles.unit} aria-hidden="true">
                <strong>
                  {remaining
                    ? String(remaining[unit.key]).padStart(2, "0")
                    : "--"}
                </strong>
                <span>{unit.label}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
