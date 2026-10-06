"use client";

import { ArrowUpRight, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { contactDetails } from "@/components/contact-details";
import { useWorkshopConfiguration } from "@/components/workshops/use-workshop-configuration";
import type { PublicWorkshopConfiguration } from "@/lib/workshops/public-configuration";
import { WORKSHOP_ICON_MAP } from "@/components/workshops/workshop-icon";
import type { WorkshopTheme } from "@/lib/workshops/workshop-data";

import styles from "./workshop-registration-options.module.css";

const themeClasses: Record<WorkshopTheme, string> = {
  "cyan-blue": styles.toolsOption,
  "blue-violet": styles.developerOption,
  "orange-cyan": styles.roboticsOption,
  "emerald-blue": styles.emeraldOption,
};
const FALLBACK_UNAVAILABLE_MESSAGE =
  "Workshop registrations are currently unavailable. There are no upcoming workshop registrations at the moment. For more information about our workshops, please contact our team.";
const WORKSHOP_WHATSAPP_MESSAGE =
  "Hello, I'd like to know when the next AI & Coding workshop will be held and when registrations will open. Please share details about upcoming workshops.";
const WORKSHOP_WHATSAPP_URL = `${contactDetails.whatsapp}?text=${encodeURIComponent(
  WORKSHOP_WHATSAPP_MESSAGE,
)}`;

function formatPhone(phone: string) {
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
}

export function WorkshopRegistrationOptions({
  initialConfiguration,
}: {
  initialConfiguration: PublicWorkshopConfiguration | null;
}) {
  const state = useWorkshopConfiguration(initialConfiguration);
  const configuration = state.phase === "ready" ? state.configuration : null;
  const visibleWorkshops = (configuration?.workshops ?? []).filter(
    (workshop) => workshop.registration !== null,
  );
  const showOptions =
    configuration?.registrationsEnabled === true && visibleWorkshops.length > 0;
  const unavailableMessage =
    configuration?.noRegistrationMessage ?? FALLBACK_UNAVAILABLE_MESSAGE;

  return (
    <section
      id="workshop-registration"
      className={styles.section}
      aria-labelledby={showOptions ? "workshop-registration-title" : undefined}
      aria-label={showOptions ? undefined : "Workshop registration availability"}
    >
      <div className={`${styles.shell} ${showOptions ? "" : styles.unavailableShell}`}>
        {showOptions && (
          <div className={styles.heading}>
            <div>
              <p className={styles.eyebrow}>CHOOSE YOUR WORKSHOP</p>
              <h2 id="workshop-registration-title">Workshop Registration</h2>
            </div>
            <div className={styles.introCopy}>
              <p>Choose the workshop you&apos;re interested in and continue to its registration form.</p>
              <small>Registration availability is managed separately for each workshop.</small>
            </div>
          </div>
        )}

        {showOptions ? (
          <div className={styles.options}>
            {visibleWorkshops.map((workshop) => {
              const registration = workshop.registration!;
              const Icon = WORKSHOP_ICON_MAP[registration.icon];
              const isOpen = registration.status === "open";
              return (
                <article
                  key={workshop.id}
                  className={`${styles.option} ${themeClasses[workshop.theme]} ${isOpen ? styles.openOption : styles.fullOption}`}
                >
                  <div className={styles.identity}>
                    <span className={styles.icon} aria-hidden="true">
                      <Icon size={24} strokeWidth={1.8} />
                    </span>
                    <h3>{registration.heading}</h3>
                  </div>
                  <div className={styles.availability}>
                    <span className={styles.statusBadge}>
                      {isOpen ? "REGISTRATION OPEN" : "SEATS FULL"}
                    </span>
                    <p>
                      {isOpen ? "Registration is currently available." : registration.fullMessage}
                    </p>
                  </div>
                  {registration.status === "open" ? (
                    <a
                      className={styles.action}
                      href={registration.googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {registration.buttonLabel}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <button className={styles.action} type="button" disabled>Seats Full</button>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.unavailablePanel}>
            <div className={styles.unavailableCopy}>
              <p className={styles.statusBadge}>REGISTRATIONS UNAVAILABLE</p>
              <h3>Workshop registrations are currently unavailable.</h3>
              <p>{unavailableMessage}</p>
              <strong>{formatPhone(contactDetails.phone)}</strong>
            </div>
            <div className={styles.contactActions}>
              <a className={styles.callAction} href={contactDetails.call} aria-label={`Call ${formatPhone(contactDetails.phone)}`}>
                <Phone size={16} aria-hidden="true" />Call
              </a>
              <a className={styles.whatsappAction} href={WORKSHOP_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp size={17} aria-hidden="true" />WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
