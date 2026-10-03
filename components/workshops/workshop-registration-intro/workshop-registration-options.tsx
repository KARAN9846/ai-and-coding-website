"use client";

import {
  ArrowUpRight,
  Bot,
  Code2,
  Cpu,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";

import { contactDetails } from "@/components/contact-details";
import { useWorkshopConfiguration } from "@/components/workshops/use-workshop-configuration";
import type { WorkshopProgramId } from "@/lib/workshops/workshop-data";

import styles from "./workshop-registration-options.module.css";

const programIcons: Record<WorkshopProgramId, LucideIcon> = {
  "ai-tools-prompting": Bot,
  "ai-coding-developer-growth": Code2,
  "ai-robotics": Cpu,
};

const programClasses: Record<WorkshopProgramId, string> = {
  "ai-tools-prompting": styles.toolsOption,
  "ai-coding-developer-growth": styles.developerOption,
  "ai-robotics": styles.roboticsOption,
};

function formatPhone(phone: string) {
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
}

const FALLBACK_UNAVAILABLE_MESSAGE =
  "Workshop registration details are temporarily unavailable. Please contact our team for assistance.";

export function WorkshopRegistrationOptions() {
  const workshopConfiguration = useWorkshopConfiguration();
  const configuration =
    workshopConfiguration.phase === "ready"
      ? workshopConfiguration.configuration
      : null;
  const visibleOptions = (configuration?.options ?? []).filter(
    (option) => option.status !== "hidden",
  );
  const showOptions =
    configuration?.registrationsEnabled === true && visibleOptions.length > 0;
  const unavailableMessage =
    configuration?.noRegistrationMessage ?? FALLBACK_UNAVAILABLE_MESSAGE;

  return (
    <section
      id="workshop-registration"
      className={styles.section}
      aria-labelledby="workshop-registration-title"
    >
      <div className={styles.shell}>
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>CHOOSE YOUR WORKSHOP</p>
            <h2 id="workshop-registration-title">Workshop Registration</h2>
          </div>
          <div className={styles.introCopy}>
            <p>
              Choose the workshop you&apos;re interested in and continue to its
              registration form.
            </p>
            <small>
              Registration availability is managed separately for each
              workshop.
            </small>
          </div>
        </div>

        {showOptions ? (
          <div className={styles.options}>
            {visibleOptions.map((option) => {
              const Icon = programIcons[option.workshopId];
              const isOpen = option.status === "open";

              return (
                <article
                  key={option.workshopId}
                  className={`${styles.option} ${programClasses[option.workshopId]} ${
                    isOpen ? styles.openOption : styles.fullOption
                  }`}
                >
                  <div className={styles.identity}>
                    <span className={styles.icon} aria-hidden="true">
                      <Icon size={24} strokeWidth={1.8} />
                    </span>
                    <h3>{option.registrationHeading}</h3>
                  </div>

                  <div className={styles.availability}>
                    <span className={styles.statusBadge}>
                      {isOpen ? "REGISTRATION OPEN" : "SEATS FULL"}
                    </span>
                    <p>
                      {isOpen
                        ? "Registration is currently available."
                        : option.fullMessage}
                    </p>
                  </div>

                  {isOpen && option.googleFormUrl ? (
                    <a
                      className={styles.action}
                      href={option.googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {option.buttonLabel}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <button className={styles.action} type="button" disabled>
                      Seats Full
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.unavailablePanel}>
            <span className={styles.unavailableIcon} aria-hidden="true">
              <MessageCircle size={22} strokeWidth={1.8} />
            </span>
            <div className={styles.unavailableCopy}>
              <p className={styles.statusBadge}>REGISTRATIONS UNAVAILABLE</p>
              <h3>Workshop registrations are currently unavailable.</h3>
              <p>{unavailableMessage}</p>
              <strong>{formatPhone(contactDetails.phone)}</strong>
            </div>
            <div className={styles.contactActions}>
              <a
                href={contactDetails.call}
                aria-label={`Call ${formatPhone(contactDetails.phone)}`}
              >
                <Phone size={16} aria-hidden="true" />
                Call
              </a>
              <a
                href={contactDetails.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
